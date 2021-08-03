import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Transfer } from '../models';
import {TransferRepository} from '../repositories';
import {UserService} from '../services/userService'

export class TransferControllerController {
  constructor(
    @inject("user_service")
    public userService : UserService,
    // @repository(TransferRepository)
    // public transferRepository : TransferRepository,
  ) {}

  @post('/transfer')
  @response(200, {
    description: 'Transfer model instance',
    content: {'application/json': {schema: getModelSchemaRef(Transfer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transfer, {
            title: 'NewTransfer',
            exclude: ['id', "sourceAcctId", "destAcctId", "txnDate", "status" ],
            partial: true
          }),
        },
      },
    })
    transfer: Omit<Transfer, 'id'>,
    {senderId, recipientId, amount}: Transfer    
  ): Promise<Transfer> {
    return this.userService.transferMoney(senderId, recipientId, amount, transfer)
  }

  // @get('/transfer/count')
  // @response(200, {
  //   description: 'Transfer model count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async count(
  //   @param.where(Transfer) where?: Where<Transfer>,
  // ): Promise<Count> {
  //   return this.transferRepository.count(where);
  // }

  // @get('/transfer')
  // @response(200, {
  //   description: 'Array of Transfer model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Transfer, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async find(
  //   @param.filter(Transfer) filter?: Filter<Transfer>,
  // ): Promise<Transfer[]> {
  //   return this.transferRepository.find(filter);
  // }

  // @patch('/transfer')
  // @response(200, {
  //   description: 'Transfer PATCH success count',
  //   content: {'application/json': {schema: CountSchema}},
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Transfer, {partial: true}),
  //       },
  //     },
  //   })
  //   transfer: Transfer,
  //   @param.where(Transfer) where?: Where<Transfer>,
  // ): Promise<Count> {
  //   return this.transferRepository.updateAll(transfer, where);
  // }

  // @get('/transfer/{id}')
  // @response(200, {
  //   description: 'Transfer model instance',
  //   content: {
  //     'application/json': {
  //       schema: getModelSchemaRef(Transfer, {includeRelations: true}),
  //     },
  //   },
  // })
  // async findById(
  //   @param.path.string('id') id: string,
  //   @param.filter(Transfer, {exclude: 'where'}) filter?: FilterExcludingWhere<Transfer>
  // ): Promise<Transfer> {
  //   return this.transferRepository.findById(id, filter);
  // }

  // @patch('/transfer/{id}')
  // @response(204, {
  //   description: 'Transfer PATCH success',
  // })
  // async updateById(
  //   @param.path.string('id') id: string,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Transfer, {partial: true}),
  //       },
  //     },
  //   })
  //   transfer: Transfer,
  // ): Promise<void> {
  //   await this.transferRepository.updateById(id, transfer);
  // }

  // @put('/transfer/{id}')
  // @response(204, {
  //   description: 'Transfer PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() transfer: Transfer,
  // ): Promise<void> {
  //   await this.transferRepository.replaceById(id, transfer);
  // }

  // @del('/transfer/{id}')
  // @response(204, {
  //   description: 'Transfer DELETE success',
  // })
  // async deleteById(@param.path.string('id') id: string): Promise<void> {
  //   await this.transferRepository.deleteById(id);
  // }
}
