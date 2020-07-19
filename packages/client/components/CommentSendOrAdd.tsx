import {keyframes} from '@emotion/core'
import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import {commitLocalUpdate, createFragmentContainer} from 'react-relay'
import useAtmosphere from '~/hooks/useAtmosphere'
import CreateTaskMutation from '~/mutations/CreateTaskMutation'
import {PALETTE} from '~/styles/paletteV2'
import {BezierCurve} from '~/types/constEnums'
import {TaskStatusEnum, ThreadSourceEnum} from '~/types/graphql'
import {SORT_STEP} from '~/utils/constants'
import dndNoise from '~/utils/dndNoise'
import {CommentSendOrAdd_meeting} from '~/__generated__/CommentSendOrAdd_meeting.graphql'
import {DECELERATE} from '../styles/animation'
import Icon from './Icon'
import PlainButton from './PlainButton/PlainButton'

export type CommentSubmitState = 'send' | 'add' | 'addExpanded'

const animateIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.75);
  }
	100% {
	  opacity: 1;
	  transform: scale(1);
	}
`

const SendIcon = styled(Icon)({
  animation: `${animateIn.toString()} 300ms ${DECELERATE} `,
  opacity: 1,
  color: PALETTE.TEXT_BLUE,
  fontSize: 32,
  padding: 8
})

const AddIcon = styled(Icon)<{isExpanded: boolean}>(({isExpanded}) => ({
  padding: 4,
  paddingLeft: isExpanded ? 8 : 4,
  paddingRight: isExpanded ? 8 : 4,
  transition: `all 300ms ${BezierCurve.DECELERATE} `
}))

const AddButton = styled(PlainButton)({
  alignItems: 'center',
  color: '#fff',
  backgroundColor: PALETTE.BACKGROUND_BLUE,
  borderRadius: 16,
  display: 'flex',
  height: 32,
  padding: 0,
  maxWidth: 120,
  whiteSpace: 'nowrap',
  overflow: 'hidden'
})

const ExpandedLabel = styled('div')<{isExpanded: boolean}>(({isExpanded}) => ({
  fontSize: 14,
  fontWeight: 600,
  textAlign: 'start',
  transition: `all 300ms ${BezierCurve.DECELERATE} `,
  paddingRight: isExpanded ? 8 : 0,
  width: isExpanded ? 80 : 0
}))

const ButtonGroup = styled('div')({
  borderLeft: `1px solid ${PALETTE.BORDER_GRAY} `,
  padding: 8,
  userSelect: 'none'
})

interface Props {
  collapseAddTask: () => void
  commentSubmitState: CommentSubmitState
  getMaxSortOrder: () => number
  meeting: CommentSendOrAdd_meeting
  threadSourceId: string
  threadParentId?: string
  threadSource: string
  onSubmit: () => void
  dataCy: string
}

const CommentSendOrAdd = (props: Props) => {
  const {
    collapseAddTask,
    commentSubmitState,
    getMaxSortOrder,
    meeting,
    threadSourceId,
    threadParentId,
    threadSource,
    onSubmit,
    dataCy
  } = props
  const {id: meetingId, teamId} = meeting
  const atmosphere = useAtmosphere()
  if (commentSubmitState === 'send') {
    return (
      <PlainButton data-cy={`${dataCy}-send`} onClick={onSubmit}>
        <SendIcon>send</SendIcon>
      </PlainButton>
    )
  }
  const addTask = () => {
    const {viewerId} = atmosphere
    const newTask = {
      status: TaskStatusEnum.active,
      sortOrder: dndNoise(),
      meetingId,
      threadId: threadSourceId,
      threadParentId,
      threadSource: threadSource as ThreadSourceEnum,
      threadSortOrder: getMaxSortOrder() + SORT_STEP + dndNoise(),
      userId: viewerId,
      teamId
    }
    CreateTaskMutation(atmosphere, {newTask}, {})
    collapseAddTask()
    commitLocalUpdate(atmosphere, (store) => {
      store.get(meetingId)?.setValue('', 'replyingToCommentId')
    })
  }
  const isExpanded = commentSubmitState === 'addExpanded'
  return (
    <ButtonGroup data-cy={`${dataCy}-add`}>
      <AddButton onClick={addTask}>
        <AddIcon isExpanded={isExpanded}>playlist_add_check</AddIcon>
        <ExpandedLabel isExpanded={isExpanded}>Add a Task</ExpandedLabel>
      </AddButton>
    </ButtonGroup>
  )
}

export default createFragmentContainer(CommentSendOrAdd, {
  meeting: graphql`
    fragment CommentSendOrAdd_meeting on NewMeeting {
      id
      teamId
    }
  `
})
