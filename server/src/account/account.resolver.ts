import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AccountService } from "./account.service";
import { Account, AccountCreateInput } from "./entities";

@Resolver("Account")
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Mutation(() => Account)
  createAccount(@Args("createInput") createInput: AccountCreateInput) {
    return this.accountService.createAccount(createInput);
  }

  @Query(() => [Account])
  readAccounts() {
    return this.accountService.readAccounts();
  }
}
