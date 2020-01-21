/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AllProjects
// ====================================================

export interface AllProjects_allProjects {
  id: number;
  /**
   * Project title
   */
  title: string;
  /**
   * Description of this project
   */
  description: string;
  /**
   * Is this project active?
   */
  active: boolean;
  /**
   * Number of entries for this project
   */
  entryCount: number | null;
}

export interface AllProjects {
  allProjects: AllProjects_allProjects[];
}
