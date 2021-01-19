/* tslint:disable */
/* eslint-disable */
// @generated
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
  projectId?: number | null;
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

export interface ProjectUpdateInput {
  id: number;
  title?: string | null;
  description?: string | null;
  active?: boolean | null;
}

export interface RoleCreateInput {
  name: string;
  description: string;
}

export interface RoleUpdateInput {
  id: number;
  name?: string | null;
  description?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
