import { repository } from "@loopback/repository";
import {HttpErrors} from '@loopback/rest';
import { Transfer, TransferStatus, User } from "../models";
import { TransferRepository, UserRepository } from "../repositories";

//Bcrypt hashing
import * as bcrypt from 'bcrypt';
const saltRounds = 10;

//Custom Errors
const passwordLength = "Password must be at least 5 characters";
const wrongBalance = "Balance cannot be a negative number";

export class UserService {

    constructor(
        @repository(TransferRepository)
        private transferRepository: TransferRepository,
        @repository(UserRepository)
        private userRepo: UserRepository) {
    }

    async createUser(user: User) {

        let {email, password, balance, accounts} = user;

        if (password.length > 5){

            //Hashing user's password
            bcrypt.hash(password, saltRounds, (err, hash) => {
                password = hash;
                return this.userRepo.create({email, password, accounts, balance});
            })
        }

        else{
            throw new HttpErrors.Unauthorized(passwordLength)
        }


        

    }

    

    async updateCash(id: string, balance: number) {
        let foundId = await this.userRepo.findById(id);
        foundId.balance += balance;
        return this.userRepo.updateById(id, foundId)
    }

    async findAllUsers() {
        return this.userRepo.find();
    }

    async getAllTransfers() {
        return this.transferRepository.find();
    }

    async transferMoney({ senderId, recipientId, amount, sourceAcctId, destAcctId, txnDate, status }: Transfer) {

        let sender = await this.userRepo.findById(senderId);
        let receiver = await this.userRepo.findById(recipientId);

        sourceAcctId = sender.accounts[0].bankInfo?.accountNum as string;
        destAcctId = receiver.accounts[0].bankInfo?.accountNum as string;

        if (sender.balance >= amount) {
            sender.balance -= amount;
            receiver.balance += amount;

            await this.userRepo.updateById(sender.id, sender);
            await this.userRepo.updateById(receiver.id, receiver);

            txnDate = new Date().toISOString();
            status = TransferStatus.COMPLETED;

            return this.transferRepository.create({ senderId, recipientId, amount, sourceAcctId, destAcctId, txnDate, status });
        }

        else {
            throw new Error('The sender has insufficient balance')
        }


    }

}



// if (sender.balance > 0) {
//     sender.balance -= amount;
//     receiver.balance += amount;

//     await this.userRepo.updateById(sender.id, sender);
//     await this.userRepo.updateById(receiver.id, receiver);




//     return this.transferRepository.create(transfer);
// }

// else{
//     throw new Error("Insufficient balance");
// }