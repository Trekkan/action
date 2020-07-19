import {GraphQLEnumType} from 'graphql'
import {
  LOBBY,
  AGENDA_ITEMS,
  CHECKIN,
  DISCUSS,
  FIRST_CALL,
  GROUP,
  LAST_CALL,
  REFLECT,
  UPDATES,
  VOTE
} from 'parabol-client/utils/constants'

const NewMeetingPhaseTypeEnum = new GraphQLEnumType({
  name: 'NewMeetingPhaseTypeEnum',
  description: 'The phase of the meeting',
  values: {
    // NA
    [LOBBY]: {},
    // Generic
    [CHECKIN]: {},
    // Check-in
    [UPDATES]: {},
    [FIRST_CALL]: {},
    [AGENDA_ITEMS]: {},
    [LAST_CALL]: {},
    // Retro
    [REFLECT]: {},
    [GROUP]: {},
    [VOTE]: {},
    [DISCUSS]: {},
    SUMMARY: {}
  }
})

export default NewMeetingPhaseTypeEnum
