import {Entity, model, property} from '@loopback/repository';

export enum TransferStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed'
}

@model()
export class Transfer extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  senderId: string;

  @property({
    type: 'string',
  })
  recipientId: string;

  @property({
    type: 'number',
  })
  amount: number;

  @property({
    type: 'string',
    required: true,
  })
  sourceAcctId?: string;

  @property({
    type: 'string',
  })
  destAcctId?: string;

  @property({
    type: 'date',
  })
  txnDate?: string;

  @property({
    type: 'string',
  })
  status: TransferStatus;


  constructor(data?: Partial<Transfer>) {
    super(data);
  }
}

export interface TransferRelations {
  // describe navigational properties here
}

export type TransferWithRelations = Transfer & TransferRelations;
