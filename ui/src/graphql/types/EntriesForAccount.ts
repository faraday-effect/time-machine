/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EntriesForAccount
// ====================================================

export interface EntriesForAccount_accountEntries {
  id: number;
  start: string;
  stop: string;
  description: string;
  created: any;
  updated: any;
}

export interface EntriesForAccount {
  accountEntries: EntriesForAccount_accountEntries[];
}

export interface EntriesForAccountVariables {
  accountId: number;
}
