<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row class="align-baseline">
          <v-col>
            <h1 class="title">Roles</h1>
          </v-col>
          <v-col>
            <v-btn color="primary" @click="showCreateDialog">
              Add Role
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table :headers="headers" :items="allRoles">
        <template v-slot:item.actions="{ item }">
          <action-icons
            @update="showUpdateDialog(item)"
            @delete="deleteRole(item.id)"
          />
        </template>
        <template v-slot:item.active="{ item }">
          <v-icon v-if="item.active" color="success">
            mdi-check-circle-outline
          </v-icon>
          <v-icon v-else color="error">
            mdi-minus-circle-outline
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <role-dialog
      v-model="createDialog.visible"
      title="Create role"
      :role="{}"
      @ready="createRole"
    />

    <role-dialog
      v-model="updateDialog.visible"
      title="Update role"
      :role="updateDialog.role"
      @ready="updateRole"
    />

    <v-snackbar v-model="snackbar.visible">
      <v-btn text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ActionIcons from "@/components/ActionIcons.vue";
import RoleDialog from "@/components/dialogs/RoleDialog.vue";

import { pick } from "lodash";
import {
  ALL_ROLES,
  CREATE_ROLE,
  DELETE_ROLE,
  UPDATE_ROLE
} from "@/graphql/roles.graphql";
import {
  CreateRole,
  CreateRole_newRole as Role,
  CreateRoleVariables
} from "@/graphql/types/CreateRole";
import { UpdateRole, UpdateRoleVariables } from "@/graphql/types/UpdateRole";
import { DeleteRole, DeleteRoleVariables } from "@/graphql/types/DeleteRole";

export default Vue.extend({
  name: "Roles",

  components: {
    ActionIcons,
    RoleDialog
  },

  apollo: {
    allRoles: {
      query: ALL_ROLES
    }
  },

  data() {
    return {
      allRoles: [] as Role[],

      sortBy: "title",

      createDialog: {
        visible: false
      },

      updateDialog: {
        role: {} as Role,
        visible: false
      },

      headers: [
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
        { text: "Actions", value: "actions" }
      ],

      snackbar: {
        visible: false,
        content: ""
      }
    };
  },

  methods: {
    showSnackbar(content: string) {
      this.snackbar.content = content;
      this.snackbar.visible = true;
    },

    showCreateDialog() {
      this.createDialog.visible = true;
    },

    showUpdateDialog(role: Role) {
      this.updateDialog.role = role;
      this.updateDialog.visible = true;
    },

    createRole(role: Role) {
      this.$apollo
        .mutate<CreateRole>({
          mutation: CREATE_ROLE
          // variables: {
          //   createInput: role
          // } as CreateRoleVariables
        })
        .then(result => {
          const newRole = result.data!.newRole;
          this.allRoles.push(newRole);
          this.showSnackbar(`Created role ${newRole.name}`);
        });
    },

    updateRole(role: Role) {
      this.$apollo
        .mutate<UpdateRole>({
          mutation: UPDATE_ROLE,
          variables: {
            updateInput: pick(role, ["id", "title", "description", "active"])
          } as UpdateRoleVariables
        })
        .then(result => {
          const updatedRole = result.data!.updatedRole;
          const idx = this.allRoles.findIndex(
            role => role.id === updatedRole.id
          );
          this.$set(this.allRoles, idx, updatedRole);
          this.showSnackbar(`Updated role ${updatedRole.name}`);
        });
    },

    deleteEntity(id: number) {
      this.$apollo
        .mutate<DeleteRole>({
          mutation: DELETE_ROLE,
          variables: { id } as DeleteRoleVariables
        })
        .then(() => {
          const idx = this.allRoles.findIndex(role => role.id === id);
          this.allRoles.splice(idx, 1);
          this.showSnackbar("Role deleted");
        });
    }
  }
});
</script>
