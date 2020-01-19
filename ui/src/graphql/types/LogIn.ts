/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LoginCredentials } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: LogIn
// ====================================================

export interface LogIn_login_claims_roles {
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

export interface LogIn_login_claims {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: LogIn_login_claims_roles[];
}

export interface LogIn_login {
  token: string;
  claims: LogIn_login_claims;
}

export interface LogIn {
  login: LogIn_login;
}

export interface LogInVariables {
  credentials: LoginCredentials;
}
