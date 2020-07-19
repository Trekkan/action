/**
 * Removes a reflection for the retrospective meeting.
 *
 */
import {commitMutation} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import handleRemoveReflectionGroups from './handlers/handleRemoveReflectionGroups'
import {IRetroReflection, IRetroReflectionGroup} from '../types/graphql'
import {BaseLocalHandlers, SharedUpdater, StandardMutation} from '../types/relayMutations'
import {RemoveReflectionMutation as TRemoveReflectionMutation} from '../__generated__/RemoveReflectionMutation.graphql'
import safeRemoveNodeFromArray from '../utils/relay/safeRemoveNodeFromArray'
import {RemoveReflectionMutation_meeting} from '~/__generated__/RemoveReflectionMutation_meeting.graphql'
import {RecordSourceSelectorProxy} from 'relay-runtime'

graphql`
  fragment RemoveReflectionMutation_meeting on RemoveReflectionPayload {
    meeting {
      id
    }
    reflection {
      id
      reflectionGroupId
    }
    unlockedStages {
      id
      isNavigableByFacilitator
    }
  }
`

const mutation = graphql`
  mutation RemoveReflectionMutation($reflectionId: ID!) {
    removeReflection(reflectionId: $reflectionId) {
      ...RemoveReflectionMutation_meeting @relay(mask: false)
    }
  }
`

const removeReflectionAndEmptyGroup = (
  reflectionId: string,
  meetingId: string,
  store: RecordSourceSelectorProxy<any>
) => {
  const reflection = store.get<IRetroReflection>(reflectionId)
  if (!reflection) return
  const reflectionGroupId = reflection.getValue('reflectionGroupId')
  const reflectionGroup = store.get<IRetroReflectionGroup>(reflectionGroupId)
  if (!reflectionGroup) return
  safeRemoveNodeFromArray(reflectionId, reflectionGroup, 'reflections')
  const reflections = reflectionGroup.getLinkedRecords('reflections')
  if (reflections.length === 0) {
    handleRemoveReflectionGroups(reflectionGroupId, meetingId, store)
  }
}

export const removeReflectionMeetingUpdater: SharedUpdater<RemoveReflectionMutation_meeting> = (
  payload,
  {store}
) => {
  const meeting = payload.getLinkedRecord('meeting')
  const meetingId = meeting.getValue('id')
  const reflection = payload.getLinkedRecord('reflection')
  const reflectionId = reflection.getValue('id')
  removeReflectionAndEmptyGroup(reflectionId, meetingId, store)
}

interface Handlers extends BaseLocalHandlers {
  meetingId: string
}

const RemoveReflectionMutation: StandardMutation<TRemoveReflectionMutation, Handlers> = (
  atmosphere,
  variables,
  {onError, onCompleted, meetingId}
) => {
  return commitMutation<TRemoveReflectionMutation>(atmosphere, {
    mutation,
    variables,
    updater: (store) => {
      const payload = store.getRootField('removeReflection')
      if (!payload) return
      removeReflectionMeetingUpdater(payload, {atmosphere, store})
    },
    optimisticUpdater: (store) => {
      const {reflectionId} = variables
      removeReflectionAndEmptyGroup(reflectionId, meetingId, store)
    },
    onCompleted,
    onError
  })
}

export default RemoveReflectionMutation
