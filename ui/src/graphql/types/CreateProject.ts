/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProjectCreateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateProject
// ====================================================

export interface CreateProject_createProject {
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

export interface CreateProject {
  createProject: CreateProject_createProject;
}

export interface CreateProjectVariables {
  createInput: ProjectCreateInput;
}
