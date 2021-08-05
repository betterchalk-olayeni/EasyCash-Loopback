import { Entity, model, property } from '@loopback/repository';

export enum AccountType {
  BANK = 'Bank',
  CASH = 'Cash',
  CREDITCARD = 'Credit Card'
}

@model()
class BankInfo {
  @property()
  bankName: string
  @property()
  accountNum: string
}

@model()
export class Account extends Entity {
  @property({
    type: 'string',
  })
  id?: string;


  @property({
    required: true,
  })
  type: AccountType;

  @property()
  bankInfo?: BankInfo


  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // describe navigational properties here
}

export type AccountWithRelations = Account & AccountRelations;


  // @property({
  //   type: 'array',
  //   itemType: 'string',
  //   required: true,
  // })
  // type: string[];
  // jsonSchema: {
    //   enum: Object.values(AccountType),
    // },

