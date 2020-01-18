import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account, AccountCreateInput, AccountUpdateInput } from "./entities";
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

  updateAccount(updateInput: AccountUpdateInput) {
    return this.accountRepo
      .preload(updateInput)
      .then(result => this.accountRepo.save(result));
  }

  deleteAccount(id: number) {
    return this.accountRepo.delete(id).then(result => result.affected);
  }
}
