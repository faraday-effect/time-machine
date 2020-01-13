import gql from "graphql-tag";

export const ALL_ENTRIES = gql`
  query AllEntries {
    allEntries: readEntries {
      id
      created
      updated
      start
      stop
      description
    }
  }
`;
