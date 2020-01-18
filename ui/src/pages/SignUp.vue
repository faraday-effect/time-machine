<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Sign Up</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="formValid">
              <v-text-field
                v-model="email"
                label="Email"
                :rules="validator.email"
              />

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="validator.password"
              />
              <v-text-field
                v-model="repeatPassword"
                label="Repeat password"
                type="password"
                :rules="validator.passwordMatch"
              />

              <v-text-field
                v-model="firstName"
                label="First name"
                :rules="validator.name"
              />
              <v-text-field
                v-model="lastName"
                label="Last name"
                :rules="validator.name"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text>Cancel</v-btn>
            <v-btn text @click="signUp" color="primary" :disabled="!formValid">
              Sign Up
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show">
      {{ snackbar.text }}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { CREATE_ACCOUNT } from "@/graphql/accounts.graphql";
import {
  CreateAccount,
  CreateAccountVariables
} from "@/graphql/types/CreateAccount";

export default Vue.extend({
  name: "SignUp",

  data() {
    return {
      email: "",
      password: "",
      repeatPassword: "",
      firstName: "",
      lastName: "",

      formValid: false,

      snackbar: {
        show: false,
        text: ""
      }
    };
  },

  computed: {
    validator() {
      return {
        email: [(v: string) => /^.+@.+$/.test(v) || "Invalid email address"],
        password: [
          (v: string) => /[A-Z]/.test(v) || "Upper case letter required",
          (v: string) => /[a-z]/.test(v) || "Lower case letter required",
          (v: string) => /\d/.test(v) || "Digit required",
          (v: string) => v.length > 6 || "Minimum six characters"
        ],
        passwordMatch: [
          (v: string) => (!!v && v) === this.password || "Passwords don't match"
        ],
        name: [(v: string) => v.length > 2 || "Too short"]
      };
    }
  },

  methods: {
    showSnackbar(text: string) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },

    signUp() {
      this.$apollo
        .mutate<CreateAccount>({
          mutation: CREATE_ACCOUNT,
          variables: {
            createInput: {
              email: this.email,
              password: this.password,
              firstName: this.firstName,
              lastName: this.lastName
            }
          } as CreateAccountVariables
        })
        .then(result => {
          this.showSnackbar(
            `${result.data!.createAccount.firstName} signed up successfully`
          );
        })
        .catch(error => this.showSnackbar(error));
    }
  }
});
</script>
