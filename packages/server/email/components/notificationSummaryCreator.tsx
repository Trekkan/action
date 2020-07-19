import Oy from 'oy-vey'
import {ContactInfo, ExternalLinks} from 'parabol-client/types/constEnums'
import plural from 'parabol-client/utils/plural'
import React from 'react'
import makeAppLink from '../../utils/makeAppLink'
import NotificationSummaryEmail, {NotificationSummaryProps} from './NotificationSummaryEmail'

const textOnlySummary = (props: NotificationSummaryProps) => {
  const {preferredName, notificationCount} = props
  const taskUrl = makeAppLink('me/tasks')
  return `Hi ${preferredName} -

You have ${notificationCount} new ${plural(
    notificationCount,
    'notification'
  )} — see what’s changed with your teams.

You can see everything on your plate in the Tasks view: ${taskUrl}

If you need anything from us, don’t hesitate to reach out at ${ContactInfo.EMAIL_LOVE}.

Have fun & do great work,
- Parabol Team
${ExternalLinks.TEAM}
`
}

const notificationSummaryCreator = (props: NotificationSummaryProps) => {
  const {notificationCount} = props
  const subject = `You have ${notificationCount} new ${plural(
    notificationCount,
    'notification'
  )} 👀`
  return {
    subject,
    body: textOnlySummary(props),
    html: Oy.renderTemplate(<NotificationSummaryEmail {...props} />, {
      title: subject,
      previewText: subject
    })
  }
}

export default notificationSummaryCreator
