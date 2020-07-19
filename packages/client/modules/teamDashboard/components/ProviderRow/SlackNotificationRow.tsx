import React from 'react'
import styled from '@emotion/styled'
import Toggle from '../../../../components/Toggle/Toggle'
import {createFragmentContainer} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {SlackNotificationRow_viewer} from '../../../../__generated__/SlackNotificationRow_viewer.graphql'
import useAtmosphere from '../../../../hooks/useAtmosphere'
import useMutationProps from '../../../../hooks/useMutationProps'
import SetSlackNotificationMutation from '../../../../mutations/SetSlackNotificationMutation'
import StyledError from '../../../../components/StyledError'
import {SlackNotificationEventEnum} from '../../../../types/graphql'
import {MeetingLabels} from '../../../../types/constEnums'

interface Props {
  event: SlackNotificationEventEnum
  localChannelId: string | null
  viewer: SlackNotificationRow_viewer
  teamId: string
}

const labelLookup = {
  [SlackNotificationEventEnum.meetingEnd]: 'Meeting End',
  [SlackNotificationEventEnum.meetingStart]: 'Meeting Start',
  [SlackNotificationEventEnum.MEETING_STAGE_TIME_LIMIT_END]: `Meeting ${MeetingLabels.TIME_LIMIT} Ended`,
  [SlackNotificationEventEnum.MEETING_STAGE_TIME_LIMIT_START]: `Meeting ${MeetingLabels.TIME_LIMIT} Started`
}

const Row = styled('div')({
  alignItems: 'center',
  display: 'flex',
  padding: '8px 0'
})

const Label = styled('span')({
  fontSize: 14,
  marginRight: 16,
  width: '100%'
})

const SlackNotificationRow = (props: Props) => {
  const {event, localChannelId, teamId, viewer} = props
  const {teamMember} = viewer
  const {slackNotifications} = teamMember!
  const label = labelLookup[event]
  const atmosphere = useAtmosphere()
  const existingNotification = slackNotifications.find(
    (notification) => notification.event === event
  )
  const active = !!(existingNotification && existingNotification.channelId)
  const {error, submitMutation, onCompleted, onError, submitting} = useMutationProps()
  const onClick = () => {
    if (submitting) return
    submitMutation()
    const slackChannelId = active ? null : localChannelId
    SetSlackNotificationMutation(
      atmosphere,
      {slackChannelId, slackNotificationEvents: [event as any], teamId},
      {
        onError,
        onCompleted
      }
    )
  }

  // does not show disabled when submitting because the temporary disabled mouse icon is ugly
  return (
    <>
      <Row>
        <Label>{label}</Label>
        <Toggle active={active} disabled={!localChannelId} onClick={onClick} />
      </Row>
      {error && <StyledError>{error}</StyledError>}
    </>
  )
}

export default createFragmentContainer(SlackNotificationRow, {
  viewer: graphql`
    fragment SlackNotificationRow_viewer on User {
      teamMember(teamId: $teamId) {
        slackNotifications {
          channelId
          event
        }
      }
    }
  `
})
