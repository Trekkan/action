import {CreateGitHubIssueMutation as TCreateGitHubIssueMutation} from '../__generated__/CreateGitHubIssueMutation.graphql'
import {commitMutation} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import Atmosphere from '../Atmosphere'
import {ICreateGitHubIssueOnMutationArguments, TaskServiceEnum} from '../types/graphql'
import {LocalHandlers} from '../types/relayMutations'
import createProxyRecord from '../utils/relay/createProxyRecord'

graphql`
  fragment CreateGitHubIssueMutation_task on CreateGitHubIssuePayload {
    task {
      integration {
        ... on TaskIntegrationGitHub {
          issueNumber
          service
          nameWithOwner
        }
        ...TaskIntegrationLinkIntegrationGitHub
      }
      updatedAt
    }
  }
`

const mutation = graphql`
  mutation CreateGitHubIssueMutation($nameWithOwner: String!, $taskId: ID!) {
    createGitHubIssue(nameWithOwner: $nameWithOwner, taskId: $taskId) {
      error {
        message
      }
      ...CreateGitHubIssueMutation_task @relay(mask: false)
    }
  }
`

const CreateGitHubIssueMutation = (
  atmosphere: Atmosphere,
  variables: ICreateGitHubIssueOnMutationArguments,
  {onError, onCompleted}: LocalHandlers
) => {
  return commitMutation<TCreateGitHubIssueMutation>(atmosphere, {
    mutation,
    variables,
    optimisticUpdater: (store) => {
      const {nameWithOwner, taskId} = variables
      const now = new Date()
      const task = store.get(taskId)
      if (!task) return
      const optimisticIntegration = {
        service: TaskServiceEnum.github,
        nameWithOwner,
        issueNumber: '?',
        updatedAt: now.toJSON()
      }
      const integration = createProxyRecord(store, 'TaskIntegrationGitHub', optimisticIntegration)
      task.setLinkedRecord(integration, 'integration')
    },
    onCompleted,
    onError
  })
}

export default CreateGitHubIssueMutation
