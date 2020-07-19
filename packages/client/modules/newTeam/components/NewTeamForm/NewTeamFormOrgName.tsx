import React, {Component} from 'react'
import BasicInput from '../../../../components/InputField/BasicInput'
import Radio from '../../../../components/Radio/Radio'
import {NewTeamFieldBlock} from './NewTeamForm'
import NewTeamFormBlock from './NewTeamFormBlock'

interface Props {
  dirty: boolean
  error: string | undefined
  isNewOrg: boolean
  onTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void

  onChange(e: React.ChangeEvent<HTMLInputElement>): void

  orgName: string
  placeholder: string

  onBlur(e: React.FocusEvent<HTMLInputElement>): void
}

class NewTeamFormOrgName extends Component<Props> {
  render() {
    const {
      dirty,
      error,
      isNewOrg,
      onChange,
      onTypeChange,
      orgName,
      placeholder,
      onBlur
    } = this.props
    return (
      <NewTeamFormBlock>
        <Radio
          checked={isNewOrg}
          name='isNewOrganization'
          value='true'
          label='a new organization:'
          onChange={onTypeChange}
        />
        <NewTeamFieldBlock>
          <BasicInput
            disabled={!isNewOrg}
            error={dirty ? (error as string) : undefined}
            name='orgName'
            placeholder={placeholder}
            onBlur={onBlur}
            onChange={onChange}
            value={orgName}
          />
        </NewTeamFieldBlock>
      </NewTeamFormBlock>
    )
  }
}

export default NewTeamFormOrgName
