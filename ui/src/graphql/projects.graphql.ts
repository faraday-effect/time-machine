import gql from "graphql-tag";

export const CREATE_PROJECT = gql`
  mutation CreateProject($createInput: ProjectCreateInput!) {
    newProject: createProject(createInput: $createInput) {
      id
      title
      description
      active
    }
  }
`;

export const ALL_PROJECTS = gql`
  query AllProjects {
    allProjects: readProjects {
      id
      title
      description
      active
    }
  }
`;

export const PROJECT_SUMMARIES = gql`
  query ProjectSummaries {
    projectSummaries: readProjectSummaries {
      projectId
      title
      entryCount
      totalMinutes
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($updateInput: ProjectUpdateInput!) {
    updatedProject: updateProject(updateInput: $updateInput) {
      id
      title
      description
      active
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: Int!) {
    deleteProject(id: $id)
  }
`;
