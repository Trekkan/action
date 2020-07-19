import {InvoiceLineItemEnum} from 'parabol-client/types/graphql'
import InvoiceLineItemDetail from './InvoiceLineItemDetail'
import shortid from 'shortid'

interface Input {
  id?: string
  amount: number
  description?: string | null
  details?: InvoiceLineItemDetail[]
  quantity: number
  type: InvoiceLineItemEnum
}

export default class InvoiceLineItem {
  id: string
  amount: number
  description: string | null
  details: InvoiceLineItemDetail[]
  quantity: number
  type: InvoiceLineItemEnum

  constructor(input: Input) {
    const {quantity, amount, id, description, details, type} = input
    this.id = id || shortid.generate()
    this.amount = amount
    this.description = description || null
    this.details = details || []
    this.quantity = quantity
    this.type = type
  }
}
