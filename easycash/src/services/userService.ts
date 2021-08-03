import { repository } from "@loopback/repository";
import { User } from "../models";
import { TransferRepository, UserRepository } from "../repositories";

export class UserService {

    constructor(
       @repository(TransferRepository) 
       private transferRepository: TransferRepository, 
       @repository(UserRepository)
       private userRepo: UserRepository) {
    }

    async createUser(user: User) {
        return this.userRepo.create(user)
    }

}