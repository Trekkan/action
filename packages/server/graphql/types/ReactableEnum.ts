import {GraphQLEnumType} from 'graphql'

const ReactableEnum = new GraphQLEnumType({
  name: 'ReactableEnum',
  description: 'The type of reactable',
  values: {
    COMMENT: {},
    REFLECTION: {}
  }
})

export default ReactableEnum
