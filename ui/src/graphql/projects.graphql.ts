import gql from "graphql-tag";

export const CREATE_PROJECT = gql`
  mutation CreateProject($createInput: ProjectCreateInput!) {
    createProject(createInput: $createInput) {
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
