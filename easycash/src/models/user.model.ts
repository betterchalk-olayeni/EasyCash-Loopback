import {Entity, model, property,} from '@loopback/repository';
import {Account} from './account.model'

@model()
export class User extends Entity {
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
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property.array(Account)
  accounts: Account[];

  @property({
    type: 'number',
    default: 0,
  })
  balance: number;


  constructor(data?: Partial<User>) {
    super(data);
  }

  // increaseBalance(amount:number){
  //   User.balance += amount
  // }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
