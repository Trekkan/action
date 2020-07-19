import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString
} from 'graphql'
import {GQLContext} from '../graphql'
import ActionMeeting from './ActionMeeting'
import GraphQLISO8601Type from './GraphQLISO8601Type'
import {resolveTeam} from '../resolvers'
import RetrospectiveMeeting from './RetrospectiveMeeting'
import Team from './Team'
import NewMeetingPhase from './NewMeetingPhase'
import MeetingTypeEnum from './MeetingTypeEnum'
import {ACTION, RETROSPECTIVE} from 'parabol-client/utils/constants'
import MeetingMember from './MeetingMember'
import toTeamMemberId from 'parabol-client/utils/relay/toTeamMemberId'
import {getUserId} from '../../utils/authorization'
import TeamMember from './TeamMember'
import Organization from './Organization'

export const newMeetingFields = () => ({
  id: {
    type: new GraphQLNonNull(GraphQLID),
    description: 'The unique meeting id. shortid.'
  },
  createdAt: {
    type: new GraphQLNonNull(GraphQLISO8601Type),
    description: 'The timestamp the meeting was created'
  },
  defaultFacilitatorUserId: {
    type: new GraphQLNonNull(GraphQLID),
    description:
      'The userId of the desired facilitator (different form facilitatorUserId if disconnected)'
  },
  endedAt: {
    type: GraphQLISO8601Type,
    description: 'The timestamp the meeting officially ended'
  },
  facilitatorStageId: {
    type: new GraphQLNonNull(GraphQLID),
    description: 'The location of the facilitator in the meeting'
  },
  facilitatorUserId: {
    type: new GraphQLNonNull(GraphQLID),
    description: 'The userId (or anonymousId) of the most recent facilitator'
  },
  facilitator: {
    type: new GraphQLNonNull(TeamMember),
    description: 'The facilitator team member',
    resolve: ({facilitatorUserId, teamId}, _args, {dataLoader}) => {
      const teamMemberId = toTeamMemberId(teamId, facilitatorUserId)
      return dataLoader.get('teamMembers').load(teamMemberId)
    }
  },
  meetingMembers: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MeetingMember))),
    description: 'The team members that were active during the time of the meeting',
    resolve: ({id: meetingId}, _args, {dataLoader}: GQLContext) => {
      return dataLoader.get('meetingMembersByMeetingId').load(meetingId)
    }
  },
  meetingNumber: {
    type: new GraphQLNonNull(GraphQLInt),
    description: 'The auto-incrementing meeting number for the team'
  },
  meetingType: {
    type: new GraphQLNonNull(MeetingTypeEnum)
  },
  name: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'The name of the meeting'
  },
  organization: {
    type: new GraphQLNonNull(Organization),
    description: 'The organization this meeting belongs to',
    resolve: async ({teamId}, _args, {dataLoader}: GQLContext) => {
      const team = await dataLoader.get('teams').load(teamId)
      const {orgId} = team
      return dataLoader.get('organizations').load(orgId)
    }
  },
  phases: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(NewMeetingPhase))),
    description: 'The phases the meeting will go through, including all phase-specific state',
    resolve: ({phases, id: meetingId}) => {
      return phases.map((phase) => ({
        ...phase,
        meetingId
      }))
    }
  },
  showConversionModal: {
    type: new GraphQLNonNull(GraphQLBoolean),
    description: 'true if should show the org the conversion modal, else false',
    resolve: ({showConversionModal}) => !!showConversionModal
  },
  summarySentAt: {
    type: GraphQLISO8601Type,
    description: 'The time the meeting summary was emailed to the team'
  },
  teamId: {
    type: new GraphQLNonNull(GraphQLID),
    description: 'foreign key for team'
  },
  team: {
    type: new GraphQLNonNull(Team),
    description: 'The team that ran the meeting',
    resolve: resolveTeam
  },
  updatedAt: {
    type: GraphQLISO8601Type,
    description: 'The last time a meeting was updated (stage completed, finished, etc)'
  },
  viewerMeetingMember: {
    type: new GraphQLNonNull(MeetingMember),
    description: 'The meeting member of the viewer',
    resolve: ({id: meetingId}, _args, {authToken, dataLoader}: GQLContext) => {
      const viewerId = getUserId(authToken)
      const meetingMemberId = toTeamMemberId(meetingId, viewerId)
      return dataLoader.get('meetingMembers').load(meetingMemberId)
    }
  }
})

const NewMeeting = new GraphQLInterfaceType({
  name: 'NewMeeting',
  description: 'A team meeting history for all previous meetings',
  fields: newMeetingFields,
  resolveType: ({meetingType}) => {
    const resolveTypeLookup = {
      [RETROSPECTIVE]: RetrospectiveMeeting,
      [ACTION]: ActionMeeting
    }
    return resolveTypeLookup[meetingType]
  }
})

export default NewMeeting
