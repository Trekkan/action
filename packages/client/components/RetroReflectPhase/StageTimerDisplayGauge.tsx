import React from 'react'
import styled from '@emotion/styled'
import {countdown} from '../../utils/date/relativeDate'
import {PALETTE} from '../../styles/paletteV2'
import useRefreshInterval from '../../hooks/useRefreshInterval'
import useBreakpoint from '../../hooks/useBreakpoint'
import {DECELERATE, fadeIn} from '../../styles/animation'
import {Breakpoint} from '../../types/constEnums'

interface Props {
  endTime: string
}

const Gauge = styled('div')<{isTimeUp: boolean; isDesktop}>(({isTimeUp, isDesktop}) => ({
  alignItems: 'flex-end',
  animation: `${fadeIn.toString()} 300ms ${DECELERATE}`,
  color: isTimeUp ? PALETTE.TEXT_MAIN : '#FFFFFF',
  background: isTimeUp ? PALETTE.BACKGROUND_YELLOW : PALETTE.BACKGROUND_GREEN,
  borderRadius: 4,
  display: 'flex',
  fontSize: isTimeUp ? 14 : 16,
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 600,
  justifyContent: 'center',
  lineHeight: '28px',
  margin: isDesktop ? '0 0 16px' : '0 0 8px',
  minWidth: 100,
  padding: '0 8px',
  transition: `background 1s ${DECELERATE}`,
  userSelect: 'none'
}))

const StageTimerDisplayGauge = (props: Props) => {
  const {endTime} = props
  useRefreshInterval(1000)
  const isDesktop = useBreakpoint(Breakpoint.SINGLE_REFLECTION_COLUMN)
  const timeLeft = endTime && countdown(endTime)
  const fromNow = timeLeft || 'Time’s Up!'
  return (
    <Gauge isDesktop={isDesktop} isTimeUp={!timeLeft}>
      {fromNow}
    </Gauge>
  )
}

export default StageTimerDisplayGauge
