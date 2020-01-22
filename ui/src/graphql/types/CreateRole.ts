/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RoleCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateRole
// ====================================================

export interface CreateRole_newRole {
  id: number;
  /**
   * Role name
   */
  name: string;
  /**
   * Description of this role
   */
  description: string;
}

export interface CreateRole {
  newRole: CreateRole_newRole;
}

export interface CreateRoleVariables {
  createInput: RoleCreateInput;
}
