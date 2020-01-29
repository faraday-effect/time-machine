import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Int } from "type-graphql";

import { AccountService, RoleService } from "./account.service";
import {
  Account,
  AccountCreateInput,
  AccountSummary,
  AccountUpdateInput,
  Role,
  RoleCreateInput,
  RoleUpdateInput
} from "./entities";

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

  @Query(() => [AccountSummary])
  readAccountSummaries() {
    return this.accountService.readAccountSummaries();
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

@Resolver("Role")
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Mutation(() => Role)
  createRole(@Args("createInput") createInput: RoleCreateInput) {
    return this.roleService.createRole(createInput);
  }

  @Query(() => [Role])
  readRoles() {
    return this.roleService.readRoles();
  }

  @Mutation(() => Role)
  updateRole(@Args("updateInput") updateInput: RoleUpdateInput) {
    return this.roleService.updateRole(updateInput);
  }

  @Mutation(() => Int)
  deleteRole(@Args({ name: "id", type: () => Int }) id: number) {
    return this.roleService.deleteRole(id);
  }
}
