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

export const LOGIN = gql`
  mutation LogIn($credentials: LoginCredentials!) {
    login(loginCredentials: $credentials) {
      token
      claims {
        id
        email
        firstName
        lastName
        roles {
          id
          name
          description
        }
      }
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($passwordInput: ChangePasswordInput!) {
    changePassword(passwordInput: $passwordInput)
  }
`;
