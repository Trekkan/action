import React from 'react'
import PrimaryButton from './PrimaryButton'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import hasToken from '../utils/hasToken'

const DemoCreateAccountPrimaryButton = (props: RouteComponentProps) => {
  const {history} = props
  const path = hasToken() ? '/me' : '/create-account?from=demo'
  const label = hasToken() ? 'My Dashboard' : 'Create Free Account'
  const handleClick = () => history.push(path)
  return (
    <PrimaryButton onClick={handleClick} size='medium'>
      {label}
    </PrimaryButton>
  )
}

export default withRouter(DemoCreateAccountPrimaryButton)
