import {RemoveAtlassianAuthMutation as TRemoveAtlassianAuthMutation} from '../__generated__/RemoveAtlassianAuthMutation.graphql'
import {commitMutation} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Disposable} from 'relay-runtime'
import Atmosphere from '../Atmosphere'
import {IRemoveAtlassianAuthOnMutationArguments} from '../types/graphql'
import {LocalHandlers} from '../types/relayMutations'

graphql`
  fragment RemoveAtlassianAuthMutation_team on RemoveAtlassianAuthPayload {
    user {
      ...AtlassianProviderRowViewer @relay(mask: false)
    }
  }
`

const mutation = graphql`
  mutation RemoveAtlassianAuthMutation($teamId: ID!) {
    removeAtlassianAuth(teamId: $teamId) {
      error {
        message
      }
      ...RemoveAtlassianAuthMutation_team @relay(mask: false)
    }
  }
`

const RemoveAtlassianAuthMutation = (
  atmosphere: Atmosphere,
  variables: IRemoveAtlassianAuthOnMutationArguments,
  {onError, onCompleted}: LocalHandlers
): Disposable => {
  return commitMutation<TRemoveAtlassianAuthMutation>(atmosphere, {
    mutation,
    variables,
    onError,
    onCompleted
  })
}

export default RemoveAtlassianAuthMutation
