/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EntryCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateEntry
// ====================================================

export interface CreateEntry_createEntry_project {
  id: number;
  /**
   * Project title
   */
  title: string;
}

export interface CreateEntry_createEntry {
  id: number;
  start: string;
  stop: string;
  description: string;
  created: any;
  updated: any;
  project: CreateEntry_createEntry_project;
}

export interface CreateEntry {
  createEntry: CreateEntry_createEntry;
}

export interface CreateEntryVariables {
  createInput: EntryCreateInput;
}
