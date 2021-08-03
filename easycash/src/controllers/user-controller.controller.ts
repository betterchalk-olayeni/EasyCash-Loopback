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
import {User} from '../models';
import {UserRepository} from '../repositories';
import { UserService } from '../services/userService';

export class UserControllerController {
  constructor(
    @inject("user_service")
    public userService : UserService,
  ) {}

  @post('/user')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userService.createUser(user);
  }

//   @get('/user/count')
//   @response(200, {
//     description: 'User model count',
//     content: {'application/json': {schema: CountSchema}},
//   })
//   async count(
//     @param.where(User) where?: Where<User>,
//   ): Promise<Count> {
//     return this.userRepository.count(where);
//   }

//   @get('/user')
//   @response(200, {
//     description: 'Array of User model instances',
//     content: {
//       'application/json': {
//         schema: {
//           type: 'array',
//           items: getModelSchemaRef(User, {includeRelations: true}),
//         },
//       },
//     },
//   })
//   async find(
//     @param.filter(User) filter?: Filter<User>,
//   ): Promise<User[]> {
//     return this.userRepository.find(filter);
//   }

//   @patch('/user')
//   @response(200, {
//     description: 'User PATCH success count',
//     content: {'application/json': {schema: CountSchema}},
//   })
//   async updateAll(
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(User, {partial: true}),
//         },
//       },
//     })
//     user: User,
//     @param.where(User) where?: Where<User>,
//   ): Promise<Count> {
//     return this.userRepository.updateAll(user, where);
//   }

//   @get('/user/{id}')
//   @response(200, {
//     description: 'User model instance',
//     content: {
//       'application/json': {
//         schema: getModelSchemaRef(User, {includeRelations: true}),
//       },
//     },
//   })
//   async findById(
//     @param.path.string('id') id: string,
//     @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
//   ): Promise<User> {
//     return this.userRepository.findById(id, filter);
//   }

  @patch('/user/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {exclude:["id", "email", "accounts"],partial: true}),
        },
      },
    })
    {balance}: User,
  ): Promise<void> {
    await this.userService.updateCash(id, balance);
  }

//   @put('/user/{id}')
//   @response(204, {
//     description: 'User PUT success',
//   })
//   async replaceById(
//     @param.path.string('id') id: string,
//     @requestBody() user: User,
//   ): Promise<void> {
//     await this.userRepository.replaceById(id, user);
//   }

//   @del('/user/{id}')
//   @response(204, {
//     description: 'User DELETE success',
//   })
//   async deleteById(@param.path.string('id') id: string): Promise<void> {
//     await this.userRepository.deleteById(id);
//   }
}
