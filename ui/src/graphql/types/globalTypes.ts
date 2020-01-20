/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AccountCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ChangePasswordInput {
  accountId: number;
  currentPassword: string;
  newPassword: string;
}

export interface EntryCreateInput {
  accountId: number;
  projectId: number;
  start: string;
  stop: string;
  description: string;
}

export interface EntryUpdateInput {
  id: number;
  start?: string | null;
  stop?: string | null;
  description?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ProjectCreateInput {
  title: string;
  description: string;
  active: boolean;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
