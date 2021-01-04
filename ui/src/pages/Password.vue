<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Change Password</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="formValid">
              <v-text-field
                v-model="currentPassword"
                label="Current Password"
                type="password"
                :rules="validator.password"
              />

              <v-text-field
                v-model="newPassword"
                label="New password"
                type="password"
                :rules="validator.password"
              />

              <v-text-field
                v-model="repeatedPassword"
                label="Repeat new password"
                type="password"
                :rules="validator.passwordMatch"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="cancel">Cancel</v-btn>
            <v-btn text color="primary" :disabled="!formValid" @click="update">
              Change
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.visible">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { CHANGE_PASSWORD } from "@/graphql/accounts.graphql";
import { ChangePassword } from "@/graphql/types/ChangePassword";
import { ChangePasswordInput } from "@/graphql/types/globalTypes";

export default Vue.extend({
  name: "Password",

  data() {
    return {
      formValid: false,

      currentPassword: "",
      newPassword: "",
      repeatedPassword: "",

      snackbar: {
        visible: false,
        text: "",
      },
    };
  },

  computed: {
    validator() {
      return {
        password: [
          (v: string) => /[A-Z]/.test(v) || "Upper case letter required",
          (v: string) => /[a-z]/.test(v) || "Lower case letter required",
          (v: string) => /\d/.test(v) || "Digit required",
          (v: string) => v.length > 6 || "Minimum six characters",
        ],
        passwordMatch: [
          (v: string) =>
            (!!v && v) === this.newPassword || "Passwords don't match",
        ],
      };
    },
  },

  methods: {
    showSnackbar(text: string) {
      this.snackbar.text = text;
      this.snackbar.visible = true;
    },

    cancel() {
      this.$router.go(-1);
    },

    update() {
      this.$apollo
        .mutate<ChangePassword>({
          mutation: CHANGE_PASSWORD,
          variables: {
            passwordInput: {
              accountId: this.$store.state.claims.id,
              currentPassword: this.currentPassword,
              newPassword: this.newPassword,
            } as ChangePasswordInput,
          },
        })
        .then(() => this.$router.push({ name: "home" }))
        .catch((error) => this.showSnackbar(error));
    },
  },
});
</script>
