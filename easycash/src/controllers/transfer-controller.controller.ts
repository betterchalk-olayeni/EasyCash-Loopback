//Loopback imports
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import {  Filter, repository } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, requestBody, response, RequestContext, RestBindings, } from '@loopback/rest';

//Model, Repository and service imports
import { Transfer, User } from '../models';
import { TransferRepository } from '../repositories';
import { UserService } from '../services/userService'


export class TransferControllerController {
  constructor(
    @inject("user_service")
    public userService: UserService,
    @repository(TransferRepository)
    public transferRepository: TransferRepository,
    @inject(RestBindings.Http.CONTEXT) private requestCtx: RequestContext
  ) { }


  //Post route for making a transfer
  @authenticate('jwt')
  @post('/api/transfer')
  @response(200, {
    description: 'Transfer model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Transfer) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transfer, {
            title: 'NewTransfer',
            exclude: ['id', "txnDate", "status"],
            partial: true
          }),
        },
      },
    })
    transfer: Omit<Transfer, 'id'>,
  ) {
    const { response } = this.requestCtx;
    try {
      return this.userService.transferMoney(transfer)
    }
    catch (error) {
      return response.status(400).send(`${error}`)
    }

  }
  
  
  //Route for getting all transfers
  @authenticate('jwt')
  @get('/api/transfer')
  @response(200, {
    description: 'Array of Transfer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Transfer, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Transfer) filter?: Filter<Transfer>,
  ): Promise<Transfer[]> {
    return this.userService.getAllTransfers();
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
