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
  query ReadEntries($accountId: Int) {
    readEntries(accountId: $accountId) {
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
