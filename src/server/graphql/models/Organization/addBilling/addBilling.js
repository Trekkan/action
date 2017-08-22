import {GraphQLBoolean, GraphQLID, GraphQLNonNull} from 'graphql';
import stripe from 'server/billing/stripe';
import getRethink from 'server/database/rethinkDriver';
import makeUpcomingInvoice from 'server/graphql/models/Invoice/makeUpcomingInvoice';
import getCCFromCustomer from 'server/graphql/models/Organization/addBilling/getCCFromCustomer';
import {getUserId, getUserOrgDoc, requireOrgLeader, requireWebsocket} from 'server/utils/authorization';
import {fromEpochSeconds, toEpochSeconds} from 'server/utils/epochTime';
import sendSegmentEvent from 'server/utils/sendSegmentEvent';
import {ACTION_MONTHLY, TRIAL_EXTENSION, TRIAL_PERIOD} from 'server/utils/serverConstants';
import {PAYMENT_REJECTED, TRIAL_EXPIRED, TRIAL_EXPIRES_SOON} from 'universal/utils/constants';

export default {
  type: GraphQLBoolean,
  description: `Add a credit card by passing in a stripe token encoded with all the billing details.
  Handles 4 scenarios:
    1) Updating to a new credit card
    2) Adding to extend the free trial
    3) Converting after the trial ended
    4) Payment was rejected`,
  args: {
    orgId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'the org requesting the changed billing'
    },
    stripeToken: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The token that came back from stripe'
    }
  },
  async resolve(source, {orgId, stripeToken}, {authToken, socket}) {
    const r = getRethink();
    const now = new Date();

    // AUTH
    requireWebsocket(socket);
    const userId = getUserId(authToken);
    const userOrgDoc = await getUserOrgDoc(userId, orgId);
    requireOrgLeader(userOrgDoc);

    // RESOLUTION
    const {creditCard, stripeId, stripeSubscriptionId, periodEnd, periodStart, orgUsers} = await r.table('Organization')
      .get(orgId)
      .pluck('creditCard', 'orgUsers', 'periodEnd', 'periodStart', 'stripeId', 'stripeSubscriptionId');
    const customer = await stripe.customers.update(stripeId, {source: stripeToken});
    if (periodEnd > now && stripeSubscriptionId) {
      // 1) Updating to a new credit card
      if (creditCard.last4) {
        await r.table('Organization').get(orgId).update({
          creditCard: getCCFromCustomer(customer)
        });
        sendSegmentEvent('addBilling Update Payment Success', userId, {orgId});
        // 2) Adding to extend the free trial
      } else {
        const extendedPeriodEnd = new Date(periodStart.setMilliseconds(0) + TRIAL_PERIOD + TRIAL_EXTENSION);
        stripe.subscriptions.update(stripeSubscriptionId, {
          trial_end: toEpochSeconds(extendedPeriodEnd)
        });
        await r.table('Organization').get(orgId).update({
          creditCard: getCCFromCustomer(customer),
          periodEnd: extendedPeriodEnd
        })
        // remove the oustanding notifications
          .do(() => {
            return r.table('Notification')
              .getAll(orgId, {index: 'orgId'})
              .filter({
                type: TRIAL_EXPIRES_SOON
              })
              .delete();
          });
        sendSegmentEvent('addBilling Free Trial Extended', userId, {orgId});
      }
    } else {
      // 3) Converting after the trial ended
      // 4) Payment was rejected and they're adding a new source
      const notificationToClear = creditCard.last4 ? PAYMENT_REJECTED : TRIAL_EXPIRED;
      const quantity = orgUsers.reduce((count, orgUser) => orgUser.inactive ? count : count + 1, 0);
      const subscription = await stripe.subscriptions.create({
        customer: stripeId,
        metadata: {
          orgId
        },
        plan: ACTION_MONTHLY,
        quantity
      });
      const {id, current_period_end, current_period_start} = subscription;
      await r.table('Organization').get(orgId).update({
        creditCard: getCCFromCustomer(customer),
        periodEnd: fromEpochSeconds(current_period_end),
        periodStart: fromEpochSeconds(current_period_start),
        stripeSubscriptionId: id
      })
        .do(() => {
          return r.table('Team')
            .getAll(orgId, {index: 'orgId'})
            .update({
              isPaid: true
            });
        })
        .do(() => {
          return r.table('Notification')
            .getAll(orgId, {index: 'orgId'})
            .filter({
              type: notificationToClear
            })
            .delete();
        });
      sendSegmentEvent('addBilling New Payment Success', userId, {orgId, quantity});
    }
    // nuke the upcoming invoice if it existed
    await r.table('Invoice')
      .get(`upcoming_${orgId}`)
      .delete();

    const channel = `upcomingInvoice/${orgId}`;
    const upcomingInvoice = await makeUpcomingInvoice(orgId, stripeId);
    const payload = {
      type: 'update',
      fields: upcomingInvoice
    };
    socket.emit(channel, payload);
    return true;
  }
};
