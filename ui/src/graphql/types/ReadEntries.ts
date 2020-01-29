/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ReadEntries
// ====================================================

export interface ReadEntries_readEntries_account {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ReadEntries_readEntries_project {
  id: number;
  /**
   * Project title
   */
  title: string;
}

export interface ReadEntries_readEntries {
  id: number;
  created: any;
  updated: any;
  start: string;
  stop: string;
  description: string;
  account: ReadEntries_readEntries_account;
  project: ReadEntries_readEntries_project;
}

export interface ReadEntries {
  readEntries: ReadEntries_readEntries[];
}

export interface ReadEntriesVariables {
  accountId?: number | null;
}
