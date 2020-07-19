import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React, {forwardRef, RefObject} from 'react'
import {createFragmentContainer} from 'react-relay'
import useScrollThreadList from '~/hooks/useScrollThreadList'
import {DiscussionThreadList_meeting} from '~/__generated__/DiscussionThreadList_meeting.graphql'
import {DiscussionThreadList_threadables} from '~/__generated__/DiscussionThreadList_threadables.graphql'
import {PALETTE} from '../styles/paletteV2'
import DiscussionThreadListEmptyState from './DiscussionThreadListEmptyState'
import LabelHeading from './LabelHeading/LabelHeading'
import ThreadedItem from './ThreadedItem'

const EmptyWrapper = styled('div')({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  paddingTop: 8
})

const Wrapper = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  padding: '8px 0'
})

// https://stackoverflow.com/questions/36130760/use-justify-content-flex-end-and-to-have-vertical-scrollbar
const PusherDowner = styled('div')({
  margin: '0 0 auto'
})

const Header = styled(LabelHeading)({
  borderBottom: `1px solid ${PALETTE.BORDER_LIGHTER}`,
  margin: '0 0 8px',
  padding: '6px 12px 12px',
  textTransform: 'none',
  width: '100%'
})

interface Props {
  editorRef: RefObject<HTMLTextAreaElement>
  meeting: DiscussionThreadList_meeting
  threadSourceId: string
  threadables: DiscussionThreadList_threadables
  dataCy: string
}

const DiscussionThreadList = forwardRef((props: Props, ref: any) => {
  const {editorRef, meeting, threadSourceId, threadables, dataCy} = props
  const isEmpty = threadables.length === 0
  useScrollThreadList(threadables, editorRef, ref)
  const HeaderBlock = () => <Header>{'Discussion & Takeaway Tasks'}</Header>
  if (isEmpty) {
    return (
      <EmptyWrapper>
        <HeaderBlock />
        <DiscussionThreadListEmptyState />
      </EmptyWrapper>
    )
  }

  return (
    <Wrapper data-cy={`${dataCy}`} ref={ref}>
      <HeaderBlock />
      <PusherDowner />
      {threadables.map((threadable) => {
        const {id} = threadable
        return (
          <ThreadedItem
            key={id}
            threadable={threadable}
            meeting={meeting}
            threadSourceId={threadSourceId}
          />
        )
      })}
    </Wrapper>
  )
})

export default createFragmentContainer(DiscussionThreadList, {
  meeting: graphql`
    fragment DiscussionThreadList_meeting on NewMeeting {
      ...ThreadedItem_meeting
    }
  `,
  threadables: graphql`
    fragment DiscussionThreadList_threadables on Threadable @relay(plural: true) {
      ...ThreadedItem_threadable
      id
    }
  `
})
