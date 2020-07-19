import {InvoiceItemType} from 'parabol-client/types/constEnums'
import adjustUserCount from '../../../billing/helpers/adjustUserCount'
import getRethink from '../../../database/rethinkDriver'
import MeetingSettingsAction from '../../../database/types/MeetingSettingsAction'
import MeetingSettingsRetrospective from '../../../database/types/MeetingSettingsRetrospective'
import Team from '../../../database/types/Team'
import TimelineEventCreatedTeam from '../../../database/types/TimelineEventCreatedTeam'
import addTeamIdToTMS from '../../../safeMutations/addTeamIdToTMS'
import insertNewTeamMember from '../../../safeMutations/insertNewTeamMember'
import makeRetroTemplates from './makeRetroTemplates'

interface ValidNewTeam {
  id: string
  name: string
  orgId: string
  isOnboardTeam: boolean
}

// used for addorg, addTeam
export default async function createTeamAndLeader(userId: string, newTeam: ValidNewTeam) {
  const r = await getRethink()
  const {id: teamId, orgId} = newTeam
  const organization = await r
    .table('Organization')
    .get(orgId)
    .run()
  const {tier} = organization
  const verifiedTeam = new Team({...newTeam, createdBy: userId, tier})
  const {phaseItems, templates} = makeRetroTemplates(teamId)
  const meetingSettings = [
    new MeetingSettingsRetrospective({teamId, selectedTemplateId: templates[0].id}),
    new MeetingSettingsAction({teamId})
  ]
  const timelineEvent = new TimelineEventCreatedTeam({
    createdAt: new Date(Date.now() + 5),
    userId,
    teamId,
    orgId
  })

  const [organizationUser] = await Promise.all([
    r
      .table('OrganizationUser')
      .getAll(userId, {index: 'userId'})
      .filter({removedAt: null, orgId})
      .nth(0)
      .default(null)
      .run(),
    // insert team
    r
      .table('Team')
      .insert(verifiedTeam, {returnChanges: true})('changes')(0)('new_val')
      .default(null)
      .run(),
    // add meeting settings
    r
      .table('MeetingSettings')
      .insert(meetingSettings)
      .run(),
    // add customizable phase items for meetings
    r
      .table('CustomPhaseItem')
      .insert(phaseItems)
      .run(),
    r
      .table('ReflectTemplate')
      .insert(templates)
      .run(),
    // denormalize common fields to team member
    insertNewTeamMember(userId, teamId),
    r
      .table('TimelineEvent')
      .insert(timelineEvent)
      .run(),
    addTeamIdToTMS(userId, teamId)
  ])

  if (!organizationUser) {
    await adjustUserCount(userId, orgId, InvoiceItemType.ADD_USER)
  }
}
