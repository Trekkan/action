import {commitMutation} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Disposable} from 'relay-runtime'
import Atmosphere from '../Atmosphere'
import {CompletedHandler, ErrorHandler} from '../types/relayMutations'
import {IRenameReflectTemplatePromptOnMutationArguments} from '../types/graphql'

graphql`
  fragment RenameReflectTemplatePromptMutation_team on RenameReflectTemplatePromptPayload {
    prompt {
      question
    }
  }
`

const mutation = graphql`
  mutation RenameReflectTemplatePromptMutation($promptId: ID!, $question: String!) {
    renameReflectTemplatePrompt(promptId: $promptId, question: $question) {
      error {
        message
      }
      ...RenameReflectTemplatePromptMutation_team @relay(mask: false)
    }
  }
`

const RenameReflectTemplatePromptMutation = (
  atmosphere: Atmosphere,
  variables: IRenameReflectTemplatePromptOnMutationArguments,
  _context: {},
  onError: ErrorHandler,
  onCompleted: CompletedHandler
): Disposable => {
  return commitMutation(atmosphere, {
    mutation,
    variables,
    onCompleted,
    onError,
    optimisticUpdater: (store) => {
      const {question, promptId} = variables
      const prompt = store.get(promptId)
      if (!prompt) return
      prompt.setValue(question, 'question')
    }
  })
}

export default RenameReflectTemplatePromptMutation
