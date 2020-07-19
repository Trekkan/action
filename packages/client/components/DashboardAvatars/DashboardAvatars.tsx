import styled from '@emotion/styled'
import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import {createFragmentContainer} from 'react-relay'
import {Breakpoint} from '~/types/constEnums'
import makeMinWidthMediaQuery from '~/utils/makeMinWidthMediaQuery'
import {DashboardAvatars_team} from '../../__generated__/DashboardAvatars_team.graphql'
import AddTeamMemberAvatarButton from '../AddTeamMemberAvatarButton'
import ErrorBoundary from '../ErrorBoundary'
import DashboardAvatar from './DashboardAvatar'

const desktopBreakpoint = makeMinWidthMediaQuery(Breakpoint.SIDEBAR_LEFT)

const AvatarsList = styled('div')({
  display: 'flex',
  overflow: 'auto',
  marginTop: 16,
  maxWidth: '100%',
  [desktopBreakpoint]: {
    marginTop: 0,
    overflow: 'visible'
  }
})

const ItemBlock = styled('div')({
  marginRight: 8,
  position: 'relative',
  [desktopBreakpoint]: {
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 0
  }
})

interface Props {
  team: DashboardAvatars_team
}

const DashboardAvatars = (props: Props) => {
  const {team} = props
  const {id: teamId, isLead: isViewerLead, teamMembers} = team
  return (
    <AvatarsList>
      <ItemBlock>
        <AddTeamMemberAvatarButton teamId={teamId} teamMembers={teamMembers} />
      </ItemBlock>
      {teamMembers.map((teamMember) => {
        return (
          <ItemBlock key={`dbAvatar${teamMember.id}`}>
            <ErrorBoundary>
              <DashboardAvatar isViewerLead={isViewerLead} teamMember={teamMember} />
            </ErrorBoundary>
          </ItemBlock>
        )
      })}
    </AvatarsList>
  )
}

export default createFragmentContainer(DashboardAvatars, {
  team: graphql`
    fragment DashboardAvatars_team on Team {
      id
      isLead
      teamMembers(sortBy: "preferredName") {
        ...AddTeamMemberAvatarButton_teamMembers
        ...DashboardAvatar_teamMember
        id
      }
    }
  `
})
