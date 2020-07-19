import shortid from 'shortid'
import {SuggestedActionTypeEnum} from 'parabol-client/types/graphql'

interface Input {
  id?: string
  createdAt?: Date
  priority: number
  removedAt?: Date | null
  type: SuggestedActionTypeEnum
  userId: string
}

export default abstract class SuggestedAction {
  id: string
  createdAt: Date
  priority: number
  removedAt: Date | null
  type: SuggestedActionTypeEnum
  userId: string

  protected constructor(input: Input) {
    const {type, userId, id, createdAt, priority, removedAt} = input
    this.id = id || shortid.generate()
    this.createdAt = createdAt || new Date()
    this.userId = userId
    this.type = type
    this.priority = priority
    this.removedAt = removedAt || null
  }
}
