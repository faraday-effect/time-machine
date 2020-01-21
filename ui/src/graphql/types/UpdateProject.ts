/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProjectUpdateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateProject
// ====================================================

export interface UpdateProject_updatedProject {
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

export interface UpdateProject {
  updatedProject: UpdateProject_updatedProject;
}

export interface UpdateProjectVariables {
  updateInput: ProjectUpdateInput;
}
