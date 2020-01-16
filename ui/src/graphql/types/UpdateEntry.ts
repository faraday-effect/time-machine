/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EntryUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateEntry
// ====================================================

export interface UpdateEntry_updateEntry {
  id: number;
  created: any;
  updated: any;
  start: string;
  stop: string;
  description: string;
}

export interface UpdateEntry {
  updateEntry: UpdateEntry_updateEntry;
}

export interface UpdateEntryVariables {
  updateInput: EntryUpdateInput;
}
