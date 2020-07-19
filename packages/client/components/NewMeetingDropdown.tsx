import React, {forwardRef} from 'react'
import useMenu from '../hooks/useMenu'
import DropdownToggleV2 from './DropdownToggleV2'
import MenuToggleV2Text from './MenuToggleV2Text'
import styled from '@emotion/styled'
import {NewMeeting} from '../types/constEnums'

interface Props {
  className?: string
  icon: string
  label: string
  disabled?: boolean
  onClick: ReturnType<typeof useMenu>['togglePortal']
  onMouseEnter: () => void
}

const Dropdown = styled(DropdownToggleV2)({
  width: NewMeeting.CONTROLS_WIDTH
})

const NewMeetingDropdown = forwardRef((props: Props, ref: any) => {
  const {className, icon, label, disabled, onClick, onMouseEnter} = props
  return (
    <Dropdown
      className={className}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      disabled={disabled}
      ref={ref}
    >
      <MenuToggleV2Text icon={icon} label={label} />
    </Dropdown>
  )
})

export default NewMeetingDropdown
