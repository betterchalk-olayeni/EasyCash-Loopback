import { inject } from '@loopback/core';
import { Filter } from '@loopback/repository';
import { post, param, get, getModelSchemaRef, patch, requestBody, response, SchemaObject } from '@loopback/rest';

//User Model and service
import { User } from '../models';
import { UserService } from '../services/userService';

// import {UserRepository} from '../repositories';

//Authentication imports
import { Credentials, MyUserService, TokenServiceBindings, UserServiceBindings } from '@loopback/authentication-jwt';
import { TokenService } from '@loopback/authentication';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';


//Credentials Schema object to login
const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 5 },
  },
};

//The req.body for login route
export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': { schema: CredentialsSchema },
  },
};

export class UserControllerController {
  constructor(
    @inject("user_service")
    public userService: UserService,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public jwtUserService: MyUserService,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
  ) { }

  //Post Signup route
  @post('/api/signup')
  @response(200, {
    description: 'User model instance',
    content: { 'application/json': { schema: getModelSchemaRef(User) } },
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
    user: User,
  ) {
    return this.userService.createUser(user);
  }


  //Login route
  @post('/api/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object', properties: {
                token: { type: 'string', },
              },
              title: 'Logged in',
              exclude: ['id', "balance", "accounts"],
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{ token: string }> {

    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return { token };
  }

  
  //Get all users
  @get('/api/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  //Update user's balance
  @patch('/api/user/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { exclude: ["id", "email", "accounts"], partial: true }),
        },
      },
    })
    { balance }: User,
  ): Promise<void> {
    await this.userService.updateCash(id, balance);
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
