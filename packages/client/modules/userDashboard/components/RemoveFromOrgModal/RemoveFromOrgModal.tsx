import React from 'react'
import styled from '@emotion/styled'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import DialogContainer from '../../../../components/DialogContainer'
import DialogContent from '../../../../components/DialogContent'
import DialogTitle from '../../../../components/DialogTitle'
import IconLabel from '../../../../components/IconLabel'
import PrimaryButton from '../../../../components/PrimaryButton'
import withAtmosphere, {
  WithAtmosphereProps
} from '../../../../decorators/withAtmosphere/withAtmosphere'
import RemoveOrgUserMutation from '../../../../mutations/RemoveOrgUserMutation'
import withMutationProps, {WithMutationProps} from '../../../../utils/relay/withMutationProps'

const StyledButton = styled(PrimaryButton)({
  margin: '1.5rem auto 0'
})

interface Props extends WithAtmosphereProps, WithMutationProps, RouteComponentProps<{}> {
  orgId: string
  userId: string
  preferredName: string
}

const StyledDialogContainer = styled(DialogContainer)({
  width: '400'
})

const RemoveFromOrgModal = (props: Props) => {
  const {
    atmosphere,
    history,
    onError,
    onCompleted,
    submitting,
    submitMutation,
    orgId,
    preferredName,
    userId
  } = props
  const handleClick = () => {
    submitMutation()
    RemoveOrgUserMutation(atmosphere, {orgId, userId}, {history}, onError, onCompleted)
  }
  return (
    <StyledDialogContainer>
      <DialogTitle>{'Are you sure?'}</DialogTitle>
      <DialogContent>
        {`This will remove ${preferredName} from the organization. Any outstanding tasks will be given
        to the team leads. Any time remaining on their subscription will be refunded on the next
        invoice.`}
        <StyledButton size='medium' onClick={handleClick} waiting={submitting}>
          <IconLabel icon='arrow_forward' iconAfter label={`Remove ${preferredName}`} />
        </StyledButton>
      </DialogContent>
    </StyledDialogContainer>
  )
}

export default withRouter(withAtmosphere(withMutationProps(RemoveFromOrgModal)))
