import {commitMutation} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {Disposable} from 'relay-runtime'
import Atmosphere from '../Atmosphere'
import handleMoveTemplatePrompt from './handlers/handleMoveTemplatePrompt'
import {IMoveReflectTemplatePromptOnMutationArguments} from '../types/graphql'
import getInProxy from '../utils/relay/getInProxy'

interface Context {
  templateId: string
}

graphql`
  fragment MoveReflectTemplatePromptMutation_team on MoveReflectTemplatePromptPayload {
    prompt {
      sortOrder
      templateId
    }
  }
`

const mutation = graphql`
  mutation MoveReflectTemplatePromptMutation($promptId: ID!, $sortOrder: Float!) {
    moveReflectTemplatePrompt(promptId: $promptId, sortOrder: $sortOrder) {
      error {
        message
      }
      ...MoveReflectTemplatePromptMutation_team @relay(mask: false)
    }
  }
`

export const moveReflectTemplatePromptTeamUpdater = (payload, {store}) => {
  if (!payload) return
  const templateId = getInProxy(payload, 'prompt', 'templateId')
  handleMoveTemplatePrompt(store, templateId)
}

const MoveReflectTemplatePromptMutation = (
  atmosphere: Atmosphere,
  variables: IMoveReflectTemplatePromptOnMutationArguments,
  context: Context
): Disposable => {
  return commitMutation(atmosphere, {
    mutation,
    variables,
    updater: (store) => {
      const payload = store.getRootField('moveReflectTemplatePrompt')
      if (!payload) return
      moveReflectTemplatePromptTeamUpdater(payload, {store})
    },
    optimisticUpdater: (store) => {
      const {sortOrder, promptId} = variables
      const {templateId} = context
      const prompt = store.get(promptId)
      if (!prompt) return
      prompt.setValue(sortOrder, 'sortOrder')
      handleMoveTemplatePrompt(store, templateId)
    }
  })
}

export default MoveReflectTemplatePromptMutation
