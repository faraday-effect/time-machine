import { BadRequestException, Injectable } from "@nestjs/common";
import {
  Account,
  AccountCreateInput,
  AccountUpdateInput,
  Role,
  RoleCreateInput,
  RoleUpdateInput
} from "./entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

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

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>
  ) {}

  createRole(createInput: RoleCreateInput) {
    return this.roleRepo.save(this.roleRepo.create(createInput));
  }

  readRoles() {
    return this.roleRepo.find();
  }

  updateRole(updateInput: RoleUpdateInput) {
    return this.roleRepo
      .preload(updateInput)
      .then(result => this.roleRepo.save(result));
  }

  deleteRole(id: number) {
    return this.roleRepo.delete(id).then(result => result.affected);
  }
}
