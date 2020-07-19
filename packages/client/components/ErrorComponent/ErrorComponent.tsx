import styled from '@emotion/styled'
import React from 'react'
import PrimaryButton from '~/components/PrimaryButton'
import ReportErrorFeedback from '~/components/ReportErrorFeedback'
import useModal from '~/hooks/useModal'

const ErrorBlock = styled('div')({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  width: '100%',
  height: '100%'
})

const Button = styled(PrimaryButton)({
  marginTop: 8
})

interface Props {
  error: Error
  eventId: string
}

const ErrorComponent = (props: Props) => {
  const {error, eventId} = props
  console.error(error)
  const {modalPortal, openPortal, closePortal} = useModal()
  return (
    <ErrorBlock>
      {'An error has occurred! We’ve alerted the developers. Try refreshing the page'}
      {eventId && <Button onClick={openPortal}>Report Feedback</Button>}
      {modalPortal(<ReportErrorFeedback closePortal={closePortal} eventId={eventId} />)}
    </ErrorBlock>
  )
}

export default ErrorComponent
