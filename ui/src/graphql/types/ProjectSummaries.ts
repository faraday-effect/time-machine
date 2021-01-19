/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProjectSummaries
// ====================================================

export interface ProjectSummaries_projectSummaries {
  /**
   * Project ID
   */
  projectId: number;
  /**
   * Project title
   */
  title: string;
  /**
   * Number of time entries
   */
  entryCount: number;
  /**
   * Total duration (minutes)
   */
  totalMinutes: number;
}

export interface ProjectSummaries {
  projectSummaries: ProjectSummaries_projectSummaries[];
}
