import React from 'react'
import styled from '@emotion/styled'
import DraftMentionRow from './DraftMentionRow'
import DraftionMentionDescription from './DraftMentionDescription'

export interface TagProps {
  active: boolean
  description: string
  name: string
}

const Value = styled('div')({
  fontWeight: 600,
  minWidth: 72
})

const MentionTag = (props: TagProps) => {
  const {active, description, name} = props
  return (
    <DraftMentionRow active={active}>
      <Value>{name}</Value>
      <DraftionMentionDescription>{description}</DraftionMentionDescription>
    </DraftMentionRow>
  )
}
export default MentionTag
