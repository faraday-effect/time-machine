/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EntriesByProject
// ====================================================

export interface EntriesByProject_readEntriesByProject_account {
  id: number;
  firstName: string;
  lastName: string;
}

export interface EntriesByProject_readEntriesByProject {
  id: number;
  start: string;
  stop: string;
  description: string;
  account: EntriesByProject_readEntriesByProject_account;
}

export interface EntriesByProject {
  readEntriesByProject: EntriesByProject_readEntriesByProject[];
}

export interface EntriesByProjectVariables {
  projectId: number;
}
