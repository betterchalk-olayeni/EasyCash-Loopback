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

    // async updateCash(id: string, amount: number) {
    //     const idUser = await this.userRepo.findById(id);
    //     idUser.increaseBalance(amount);
    // }

    async updateCash(id: string, balance:number) {
        let foundId = await this.userRepo.findById(id);
        foundId.balance+= balance;
        return this.userRepo.updateById(id, foundId)
    }

}