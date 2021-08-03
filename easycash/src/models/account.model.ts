import { Entity, model, property } from '@loopback/repository';

enum typeEnum {
  Bank = 'Bank',
  Cash = 'Cash',
  CreditCard = 'Credit Card'
}


@model()
export class Account extends Entity {
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
  type: typeEnum;

  @property({
    type: 'object',
  })
  bankInfo?: object;


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
    //   enum: Object.values(typeEnum),
    // },

