import { repository } from "@loopback/repository";
import { Transfer, User } from "../models";
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

    async updateCash(id: string, balance: number) {
        let foundId = await this.userRepo.findById(id);
        foundId.balance += balance;
        return this.userRepo.updateById(id, foundId)
    }

    async findAllUsers() {
        return this.userRepo.find();
    }

    async transferMoney(senderId: string, recipientId: string, amount: number, transfer:Transfer) {
        let sender = await this.userRepo.findById(senderId);
        let receiver = await this.userRepo.findById(recipientId);

        if (sender.balance > 0) {
            sender.balance -= amount;
            receiver.balance += amount;

            let updateSender = this.userRepo.updateById(senderId, sender);
            let updateReceiver = this.userRepo.updateById(recipientId, receiver);

            return this.transferRepository.create(transfer);
        }

        else{
            throw new Error("Insufficient balance");
        }


    }

}