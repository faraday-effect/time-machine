/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AccountCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateAccount
// ====================================================

export interface CreateAccount_createAccount {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CreateAccount {
  createAccount: CreateAccount_createAccount;
}

export interface CreateAccountVariables {
  createInput: AccountCreateInput;
}
