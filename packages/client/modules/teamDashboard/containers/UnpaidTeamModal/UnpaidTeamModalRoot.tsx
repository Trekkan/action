import React from 'react'
import graphql from 'babel-plugin-relay/macro'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import {QueryRenderer} from 'react-relay'
import withAtmosphere, {
  WithAtmosphereProps
} from '../../../../decorators/withAtmosphere/withAtmosphere'
import UnpaidTeamModal from '../../components/UnpaidTeamModal/UnpaidTeamModal'
import renderQuery from '../../../../utils/relay/renderQuery'

const query = graphql`
  query UnpaidTeamModalRootQuery($teamId: ID!) {
    viewer {
      ...UnpaidTeamModal_viewer
    }
  }
`

interface Props extends WithAtmosphereProps, RouteComponentProps<{}> {
  teamId: string
}

const UnpaidTeamModalRoot = (props: Props) => {
  const {atmosphere, teamId} = props
  return (
    <QueryRenderer
      environment={atmosphere}
      query={query}
      variables={{teamId}}
      fetchPolicy={'store-or-network' as any}
      render={renderQuery(UnpaidTeamModal)}
    />
  )
}

export default withAtmosphere(withRouter(UnpaidTeamModalRoot))
