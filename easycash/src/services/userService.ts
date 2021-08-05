import { repository } from "@loopback/repository";
import { HttpErrors } from '@loopback/rest';
import { Transfer, TransferStatus, User } from "../models";
import { TransferRepository, UserRepository } from "../repositories";
import {securityId, UserProfile} from '@loopback/security';
import * as _ from 'lodash';

//Bcrypt hashing
import {compare, hash} from 'bcrypt';
const saltRounds = 10;

//Custom Errors
const existingUserError = "User already exists";
const loginError = "Invalid Password";
const noUser = "User does not exist";
const invalidCredentialsError = 'Invalid email or password.';

//Login Credentials
export type Credentials = {
    email: string;
    password: string;
};


export class UserService {

    constructor(
        @repository(TransferRepository)
        private transferRepository: TransferRepository,
        @repository(UserRepository)
        private userRepo: UserRepository) {
    }

    async createUser(user: User) {

        let { email, password, balance, accounts } = user;

        //Check for already existing Email
        const existingUser = await this.userRepo.findOne({ where: { email: email.toLowerCase() } })

        if (!existingUser) {
            //Hashing user's password
            hash(password, saltRounds, (err, hash) => {
                password = hash;
                return this.userRepo.create({ email, password, accounts, balance });
            })
        }

        else {
            throw new HttpErrors.Unauthorized(existingUserError)
        }

    }


    // async login(user: User) {
    //     const { email, password } = user;

    //     const dbUser = await this.userRepo.findOne({ where: { email: email.toLowerCase() } });

    //     if (dbUser) {
    //         compare(password, dbUser.password, (err, result) => {
    //             if (result === true) {
    //                 console.log("Logged In");
    //                 return dbUser;
    //             }
    //             else {
    //                 throw new HttpErrors.Unauthorized(loginError);
    //             }
    //         })
    //     }

    //     else {
    //         throw new HttpErrors.Unauthorized(noUser);
    //     }

    // }


    async verifyCredentials(credentials: Credentials) {
        const { email, password } = credentials;

        const foundUser = await this.userRepo.findOne({
            where: { email: email.toLowerCase() },
        });

        //If user does not exist
        if (!foundUser) {
            throw new HttpErrors.Unauthorized(invalidCredentialsError);
        }

        const passwordMatch = await compare(password, foundUser.password)

        if (!passwordMatch) {
            throw new HttpErrors.Unauthorized(loginError);
          }
      
          return foundUser;

    }

     convertToUserProfile(user: User): UserProfile {
        return {
          [securityId]: user.id.toString(),
        //   name: user.username,
          id: user.id,
          email: user.email,
        };
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