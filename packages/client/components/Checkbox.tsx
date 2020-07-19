import React from 'react'
import styled from '@emotion/styled'
import {PALETTE} from '../styles/paletteV2'
import Icon from './Icon'

interface Props {
  active: boolean
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
}

const StyledIcon = styled(Icon)<{disabled: boolean | undefined}>(({disabled}) => ({
  color: PALETTE.TEXT_GRAY,
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'block',
  opacity: disabled ? 0.38 : 1,
  userSelect: 'none'
}))

const Checkbox = (props: Props) => {
  const {active, className, disabled, onClick} = props
  const icon = active ? 'check_box' : 'check_box_outline_blank'
  return (
    <StyledIcon className={className} disabled={disabled} onClick={disabled ? undefined : onClick}>
      {icon}
    </StyledIcon>
  )
}

export default Checkbox
