import {ConnectionHandler} from 'relay-runtime'
import ContentTextHandler from './ContentFilterHandler'
import LocalTimeHandler from './LocalTimeHandler'

const handlerProvider = (handle) => {
  switch (handle) {
    case 'connection':
      return ConnectionHandler
    case 'contentText':
      return ContentTextHandler
    case 'localTime':
      return LocalTimeHandler
    default:
      throw new Error(`Unknown handle ${handle}`)
  }
}

export default handlerProvider
