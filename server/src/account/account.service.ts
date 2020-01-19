import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account, AccountCreateInput, AccountUpdateInput } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>
  ) {}

  async createAccount(createInput: AccountCreateInput) {
    if (await this.findAccountByEmail(createInput.email)) {
      throw new BadRequestException(
        `The email address '${createInput.email}' is already registered.`
      );
    }
    return this.accountRepo.save(this.accountRepo.create(createInput));
  }

  readAccounts() {
    return this.accountRepo.find();
  }

  readAccount(id: number) {
    return this.accountRepo.findOne(id);
  }

  findAccountByEmail(email: string) {
    return this.accountRepo.findOne({ email }, { relations: ["roles"] });
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
