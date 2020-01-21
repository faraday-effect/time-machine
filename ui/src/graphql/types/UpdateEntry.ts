/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EntryUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateEntry
// ====================================================

export interface UpdateEntry_updateEntry_project {
  id: number;
  /**
   * Project title
   */
  title: string;
}

export interface UpdateEntry_updateEntry {
  id: number;
  start: string;
  stop: string;
  description: string;
  created: any;
  updated: any;
  project: UpdateEntry_updateEntry_project;
}

export interface UpdateEntry {
  updateEntry: UpdateEntry_updateEntry;
}

export interface UpdateEntryVariables {
  updateInput: EntryUpdateInput;
}
