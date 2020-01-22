import gql from "graphql-tag";

export const CREATE_ROLE = gql`
  mutation CreateRole($createInput: RoleCreateInput!) {
    newRole: createRole(createInput: $createInput) {
      id
    }
  }
`;

export const ALL_ROLES = gql`
  query AllRoles {
    allRoles: readRoles {
      id
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateRole($updateInput: RoleUpdateInput!) {
    updatedRole: updateRole(updateInput: $updateInput) {
      id
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: Int!) {
    deleteRole(id: $id)
  }
`;
