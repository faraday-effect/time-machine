import gql from "graphql-tag";

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($createInput: AccountCreateInput!) {
    createAccount(createInput: $createInput) {
      id
      email
      firstName
      lastName
    }
  }
`;
