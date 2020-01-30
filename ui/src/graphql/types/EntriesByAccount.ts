/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EntriesByAccount
// ====================================================

export interface EntriesByAccount_readEntriesByAccount_project {
  id: number;
  /**
   * Project title
   */
  title: string;
}

export interface EntriesByAccount_readEntriesByAccount {
  id: number;
  start: string;
  stop: string;
  description: string;
  created: any;
  updated: any;
  project: EntriesByAccount_readEntriesByAccount_project;
}

export interface EntriesByAccount {
  readEntriesByAccount: EntriesByAccount_readEntriesByAccount[];
}

export interface EntriesByAccountVariables {
  accountId: number;
}
