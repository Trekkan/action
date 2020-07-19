import React from 'react'
import {InvoiceStatusEnum} from '../../../../types/graphql'
import styled from '@emotion/styled'
import {PALETTE} from '../../../../styles/paletteV2'
import {Breakpoint} from '../../../../types/constEnums'

const FailedStamp = styled('div')({
  color: PALETTE.TEXT_RED,
  fontSize: 40,
  fontWeight: 600,
  left: '50%',
  opacity: 0.5,
  // don't let it cover up any buttons
  pointerEvents: 'none',
  position: 'absolute',
  textAlign: 'center',
  textTransform: 'uppercase',
  top: '50%',
  transform: 'translate3d(-50%, -50%, 0) rotate(-30deg)',
  width: '100%',

  [`@media (min-width: ${Breakpoint.INVOICE}px)`]: {
    fontSize: 48
  }
})

interface Props {
  status: InvoiceStatusEnum
}
const InvoiceFailedStamp = (props: Props) => {
  const {status} = props
  if (status !== InvoiceStatusEnum.FAILED) return null

  return <FailedStamp>{'Payment Failed'}</FailedStamp>
}

export default InvoiceFailedStamp
