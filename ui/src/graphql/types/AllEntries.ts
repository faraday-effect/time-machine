/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllEntries
// ====================================================

export interface AllEntries_allEntries_account {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AllEntries_allEntries_project {
  id: number;
  /**
   * Project title
   */
  title: string;
}

export interface AllEntries_allEntries {
  id: number;
  created: any;
  updated: any;
  start: string;
  stop: string;
  description: string;
  account: AllEntries_allEntries_account;
  project: AllEntries_allEntries_project;
}

export interface AllEntries {
  allEntries: AllEntries_allEntries[];
}
