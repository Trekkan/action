require('../../babelRegister')
const teardown = require('./teardown')

module.exports = (results) => {
  teardown.default(results)
  return results
}
