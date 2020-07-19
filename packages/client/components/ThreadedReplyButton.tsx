import styled from '@emotion/styled'
import React from 'react'
import PlainButton from './PlainButton/PlainButton'
import {PALETTE} from '~/styles/paletteV2'

const Reply = styled(PlainButton)({
  fontWeight: 600,
  lineHeight: '24px',
  ':hover, :focus, :active': {
    color: PALETTE.TEXT_MAIN
  }
})

interface Props {
  onReply: () => void
  dataCy: string
}

const ThreadedReplyButton = (props: Props) => {
  const {onReply, dataCy} = props
  return (
    <Reply data-cy={`${dataCy}-reply-button`} onClick={onReply}>
      Reply
    </Reply>
  )
}

export default ThreadedReplyButton
