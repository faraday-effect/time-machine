/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { RoleUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateRole
// ====================================================

export interface UpdateRole_updatedRole {
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

export interface UpdateRole {
  updatedRole: UpdateRole_updatedRole;
}

export interface UpdateRoleVariables {
  updateInput: RoleUpdateInput;
}
