import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account, AccountCreateInput } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>
  ) {}

  createAccount(createInput: AccountCreateInput) {
    return this.accountRepo.save(this.accountRepo.create(createInput));
  }

  readAccounts() {
    return this.accountRepo.find();
  }

  findAccountByEmail(email: string) {
    return this.accountRepo.findOne({ email });
  }
}
