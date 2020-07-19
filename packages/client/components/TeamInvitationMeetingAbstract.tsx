import React, {ReactNode} from 'react'
import styled from '@emotion/styled'
import {PALETTE} from '../styles/paletteV2'
import makeMinWidthMediaQuery from '../utils/makeMinWidthMediaQuery'

const PageContainer = styled('div')({
  alignItems: 'center',
  backgroundColor: PALETTE.BACKGROUND_MAIN,
  color: PALETTE.TEXT_MAIN,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '100%',
  minHeight: '100vh',
  position: 'relative'
})

const CenteredBlock = styled('div')({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  justifyContent: 'center',
  maxWidth: '100%',
  padding: '2rem 1rem',
  width: '100%',
  zIndex: 3
})

const Backdrop = styled('div')({
  backgroundColor: PALETTE.BACKGROUND_BACKDROP,
  height: '100vh',
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100vw',
  zIndex: 2
})

const MeetingAbstractContainer = styled(PageContainer)({
  alignItems: 'flex-start',
  flexDirection: 'row',
  filter: 'blur(2px)',
  left: 0,
  minWidth: '100vw',
  position: 'absolute',
  top: 0,
  zIndex: 1
})

const AbstractSidebar = styled('div')({
  display: 'none',
  [makeMinWidthMediaQuery(640)]: {
    display: 'block',
    backgroundColor: 'white',
    flexShrink: 0,
    height: '100vh',
    width: 240
  }
})

const AbstractSidebarHeading = styled('div')({
  backgroundColor: PALETTE.TEXT_MAIN,
  borderRadius: 14,
  height: 14,
  margin: '21px 0 35px 60px',
  width: 120
})

const AbstractSidebarLabel = styled('div')({
  backgroundColor: '#BAB8CA',
  borderRadius: 8,
  height: 8,
  marginLeft: 60,
  marginBottom: 30,
  width: 160
})

const AbstractSidebarNavItem = styled('div')({
  alignItems: 'center',
  display: 'flex',
  marginBottom: 18,
  paddingLeft: 24
})

const AbstractSidebarNavItemBullet = styled('div')({
  backgroundColor: PALETTE.TEXT_PURPLE,
  borderRadius: 24,
  height: 24,
  marginRight: 12,
  width: 24
})

const AbstractSidebarNavItemLabel = styled('div')({
  backgroundColor: PALETTE.TEXT_GRAY,
  borderRadius: 14,
  height: 14,
  width: 120
})

const AbstractMain = styled('div')({
  alignItems: 'center',
  display: 'flex',
  flex: 1,
  justifyContent: 'space-between',
  minHeight: 56,
  maxWidth: '100vw',
  padding: '0 20px'
})

const AbstractMainHeading = styled(AbstractSidebarNavItemLabel)({})

const AbstractAvatarGroup = styled('div')({
  display: 'flex',
  flexShrink: 0
})

const AbstractAvatar = styled('div')({
  backgroundColor: PALETTE.BACKGROUND_YELLOW,
  borderRadius: 32,
  marginLeft: 8,
  height: 32,
  width: 32
})

interface Props {
  children: ReactNode
}

const NavItem = () => (
  <AbstractSidebarNavItem>
    <AbstractSidebarNavItemBullet />
    <AbstractSidebarNavItemLabel />
  </AbstractSidebarNavItem>
)

function TeamInvitationMeetingAbstract(props: Props) {
  const {children} = props
  return (
    <PageContainer>
      <CenteredBlock>{children}</CenteredBlock>
      <Backdrop />
      <MeetingAbstractContainer>
        <AbstractSidebar>
          <AbstractSidebarHeading />
          <AbstractSidebarLabel />
          <NavItem />
          <NavItem />
          <NavItem />
          <NavItem />
          <NavItem />
        </AbstractSidebar>
        <AbstractMain>
          <AbstractMainHeading />
          <AbstractAvatarGroup>
            <AbstractAvatar />
            <AbstractAvatar />
            <AbstractAvatar />
            <AbstractAvatar />
            <AbstractAvatar />
          </AbstractAvatarGroup>
        </AbstractMain>
      </MeetingAbstractContainer>
    </PageContainer>
  )
}

export default TeamInvitationMeetingAbstract
