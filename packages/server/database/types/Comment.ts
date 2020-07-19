import shortid from 'shortid'
import Reactji from './Reactji'
import {ThreadSourceEnum} from 'parabol-client/types/graphql'
import extractTextFromDraftString from 'parabol-client/utils/draftjs/extractTextFromDraftString'

export interface CommentInput {
  id?: string
  createdAt?: Date | null
  isActive?: boolean | null
  isAnonymous?: boolean | null
  threadParentId?: string | null
  reactjis?: Reactji[] | null
  updatedAt?: Date | null
  content: string
  createdBy: string
  plaintextContent?: string // the plaintext version of content
  threadId: string // reflectionGroupId or agendaItemId
  threadSortOrder: number
  threadSource: ThreadSourceEnum
}

export default class Comment {
  id: string
  createdAt: Date
  isActive: boolean
  isAnonymous: boolean
  threadParentId?: string
  reactjis: Reactji[]
  updatedAt: Date
  content: string
  createdBy: string
  plaintextContent: string
  threadId: string // reflectionGroupId or agendaItemId
  threadSortOrder: number
  threadSource: ThreadSourceEnum

  constructor(input: CommentInput) {
    const {
      id,
      content,
      createdAt,
      createdBy,
      plaintextContent,
      threadParentId,
      threadSortOrder,
      updatedAt,
      threadId,
      threadSource,
      isActive,
      isAnonymous,
      reactjis
    } = input
    this.id = id || shortid.generate()
    this.content = content
    this.createdAt = createdAt || new Date()
    this.createdBy = createdBy
    this.plaintextContent = plaintextContent || extractTextFromDraftString(content)
    this.threadSortOrder = threadSortOrder
    this.threadParentId = threadParentId || undefined
    this.updatedAt = updatedAt || new Date()
    this.threadId = threadId
    this.threadSource = threadSource
    this.isActive = isActive ?? true
    this.isAnonymous = isAnonymous ?? false
    this.reactjis = reactjis ?? []
  }
}
