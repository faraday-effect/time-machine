import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Int } from "type-graphql";

import { AccountService } from "./account.service";
import { Account, AccountCreateInput, AccountUpdateInput } from "./entities";

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

  @Mutation(() => Account)
  updateAccount(@Args("updateInput") updateInput: AccountUpdateInput) {
    return this.accountService.updateAccount(updateInput);
  }

  @Mutation(() => Int)
  deleteAccount(@Args({ name: "id", type: () => Int }) id: number) {
    return this.accountService.deleteAccount(id);
  }
}
