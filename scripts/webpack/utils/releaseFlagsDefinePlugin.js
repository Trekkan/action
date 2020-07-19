/**
 * Exports an instance of DefinePlugin which, for all feature flags <flagName>,
 * replaces occurrences of __RELEASE_FLAGS__.<flagName> with the static
 * value of <flagName> in the bundle.
 */

import webpack from 'webpack'

const releaseFlags = {} // TODO grab from grpahql when needed
export default new webpack.DefinePlugin(
  Object.entries(releaseFlags).reduce(
    (acc, [featName, featVal]) => ({
      ...acc,
      [`__RELEASE_FLAGS__.${featName}`]: JSON.stringify(featVal)
    }),
    {}
  )
)
