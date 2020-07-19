import {GraphQLSchema, parse} from 'graphql'
import {CompiledQuery, compileQuery} from 'graphql-jit'
import getRethink from '../database/rethinkDriver'
import PROD from '../PROD'

export default class CompiledQueryCache {
  store = {} as {[docId: string]: CompiledQuery}
  private set(docId: string, queryString: string, schema: GraphQLSchema) {
    const document = parse(queryString)
    const compiledQuery = compileQuery(schema, document) as CompiledQuery
    this.store[docId] = compiledQuery
    return compiledQuery
  }
  async fromID(docId: string, schema: GraphQLSchema) {
    const compiledQuery = this.store[docId]
    if (compiledQuery) return compiledQuery
    const r = await getRethink()
    let queryString = await r
      .table('QueryMap')
      .get(docId)('query')
      .default(null)
      .run()
    if (!queryString && !PROD) {
      const queryMap = require('../../../queryMap.json')
      queryString = queryMap[docId]
    }
    if (!queryString) return undefined
    return this.set(docId, queryString, schema)
  }

  fromString(queryString: string, schema: GraphQLSchema) {
    return this.store[queryString] || this.set(queryString, queryString, schema)
  }
}
