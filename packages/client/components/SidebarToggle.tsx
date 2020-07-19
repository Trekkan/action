import React from 'react'
import IconButton from './IconButton'
import styled from '@emotion/styled'
import {PALETTE} from '../styles/paletteV2'
import {BaseButtonProps} from './BaseButton'

const StyledButton = styled(IconButton)({
  height: 24,
  padding: 0,
  ':hover,:focus,:active': {
    color: PALETTE.TEXT_GRAY
  }
})

interface Props extends BaseButtonProps {}

const SidebarToggle = (props: Props) => {
  const {dataCy} = props
  return (
    <StyledButton
      {...props}
      dataCy={`${dataCy}-toggle`}
      aria-label='Toggle the sidebar'
      icon='menu'
      iconLarge
      palette='midGray'
    />
  )
}
export default SidebarToggle
