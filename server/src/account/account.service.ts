import { BadRequestException, Injectable } from "@nestjs/common";
import {
  Account,
  AccountCreateInput,
  AccountSummary,
  AccountUpdateInput,
  Role,
  RoleCreateInput,
  RoleUpdateInput,
} from "./entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>
  ) {}

  getMetadata() {
    const metadata = this.accountRepo.metadata;
    // console.dir(metadata, { depth: 2 });
  }

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

  readAccountSummaries(): Promise<AccountSummary> {
    return this.accountRepo.query(`
            SELECT a.id                                                                 AS "accountId",
                   a."firstName",
                   a."lastName",
                   count(e)                                                             AS "entryCount",
                   extract(EPOCH FROM sum(e.stop::timestamp - e.start::timestamp)) / 60 AS "totalMinutes"
            FROM account a
                     INNER JOIN entry e ON a.id = e."accountId"
            GROUP BY a.id, a."firstName", a."lastName"
            ORDER BY a."lastName", a."firstName"`);
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
      .then((result) => this.accountRepo.save(result));
  }

  deleteAccount(id: number) {
    return this.accountRepo.delete(id).then((result) => result.affected);
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
      .then((result) => this.roleRepo.save(result));
  }

  deleteRole(id: number) {
    return this.roleRepo.delete(id).then((result) => result.affected);
  }
}
