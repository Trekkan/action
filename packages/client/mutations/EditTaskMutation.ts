import {commitMutation} from 'react-relay'
import handleEditTask from './handlers/handleEditTask'
import getOptimisticTaskEditor from '../utils/relay/getOptimisticTaskEditor'
import isTempId from '../utils/relay/isTempId'
import graphql from 'babel-plugin-relay/macro'

graphql`
  fragment EditTaskMutation_task on EditTaskPayload {
    task {
      id
    }
    editor {
      id
      preferredName
    }
    isEditing
  }
`

const mutation = graphql`
  mutation EditTaskMutation($taskId: ID!, $isEditing: Boolean!) {
    editTask(taskId: $taskId, isEditing: $isEditing) {
      error {
        message
      }
      ...EditTaskMutation_task @relay(mask: false)
    }
  }
`

export const editTaskTaskUpdater = (payload, store) => {
  handleEditTask(payload, store)
}

const EditTaskMutation = (environment, taskId, isEditing, onCompleted?, onError?) => {
  if (isTempId(taskId)) return undefined
  const {viewerId} = environment
  return commitMutation(environment, {
    mutation,
    variables: {taskId, isEditing},
    updater: (store) => {
      const payload = store.getRootField('editTask')
      if (!payload) return
      editTaskTaskUpdater(payload, store)
    },
    optimisticUpdater: (store) => {
      const payload = getOptimisticTaskEditor(store, viewerId, taskId, isEditing)
      handleEditTask(payload, store)
    },
    onCompleted,
    onError
  })
}

export default EditTaskMutation
