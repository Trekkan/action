import {PALETTE} from 'parabol-client/styles/paletteV2'
import {FONT_FAMILY} from 'parabol-client/styles/typographyV2'
import React from 'react'
import emailDir from '../../../emailDir'

const logoStyle = {
  paddingTop: 64
}

const taglineStyle = {
  color: PALETTE.TEXT_MAIN,
  fontFamily: FONT_FAMILY.SANS_SERIF,
  fontSize: 13,
  paddingTop: 8,
  paddingBottom: 32
}

const LogoFooter = () => {
  return (
    <>
      <tr>
        <td align='center' style={logoStyle}>
          <img crossOrigin='' src={`${emailDir}mark-color@3x.png`} height='28' width='31' />
        </td>
      </tr>
      <tr>
        <td align='center' style={taglineStyle}>
          {'Crafted with care by the folks at Parabol'}
        </td>
      </tr>
    </>
  )
}

export default LogoFooter
