/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AccountSummaries
// ====================================================

export interface AccountSummaries_accountSummaries {
  /**
   * Account ID
   */
  accountId: number;
  /**
   * First name
   */
  firstName: string;
  /**
   * Last name
   */
  lastName: string;
  /**
   * Number of time entries
   */
  entryCount: number;
  /**
   * Total duration (minutes)
   */
  totalMinutes: number;
}

export interface AccountSummaries {
  accountSummaries: AccountSummaries_accountSummaries[];
}
