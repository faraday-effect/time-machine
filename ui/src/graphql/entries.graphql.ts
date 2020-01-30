import gql from "graphql-tag";

export const CREATE_ENTRY = gql`
  mutation CreateEntry($createInput: EntryCreateInput!) {
    createEntry(createInput: $createInput) {
      id
      start
      stop
      description
      created
      updated
      account {
        id
        firstName
        lastName
        email
      }
      project {
        id
        title
      }
    }
  }
`;

export const READ_ENTRIES = gql`
  query ReadEntries {
    readEntries {
      id
      created
      updated
      start
      stop
      description
      account {
        id
        firstName
        lastName
        email
      }
      project {
        id
        title
      }
    }
  }
`;

export const ENTRIES_BY_PROJECT = gql`
  query EntriesByProject($projectId: Int!) {
    readEntriesByProject(projectId: $projectId) {
      id
      start
      stop
      description
      account {
        id
        firstName
        lastName
      }
    }
  }
`;

export const ENTRIES_BY_ACCOUNT = gql`
  query EntriesByAccount($accountId: Int!) {
    readEntriesByAccount(accountId: $accountId) {
      id
      start
      stop
      description
      project {
        id
        title
      }
    }
  }
`;

export const UPDATE_ENTRY = gql`
  mutation UpdateEntry($updateInput: EntryUpdateInput!) {
    updateEntry(updateInput: $updateInput) {
      id
      start
      stop
      description
      created
      updated
      project {
        id
        title
      }
    }
  }
`;

export const DELETE_ENTRY = gql`
  mutation DeleteEntry($id: Int!) {
    deleteEntry(id: $id)
  }
`;
