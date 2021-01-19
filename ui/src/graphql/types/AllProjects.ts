/* tslint:disable */
/* eslint-disable */
// @generated
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
}

export interface AllProjects {
  allProjects: AllProjects_allProjects[];
}
