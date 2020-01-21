<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Log In</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="formValid">
              <v-text-field
                v-model="email"
                label="Email"
                prepend-icon="mdi-email"
                :rules="validator.email"
              />

              <v-text-field
                v-model="password"
                label="Password"
                prepend-icon="mdi-lock"
                type="password"
                :rules="validator.password"
              />
            </v-form>
            <p class="mt-3 text-right">
              No account?
              <v-btn text small color="primary" :to="{ name: 'signup' }">
                Create Account
              </v-btn>
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text color="primary" :disabled="!formValid" @click="logIn">
              Log In
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
import { LOGIN } from "@/graphql/accounts.graphql";
import { LogIn, LogInVariables } from "@/graphql/types/LogIn";

export default Vue.extend({
  name: "LogIn",

  data() {
    return {
      formValid: false,

      email: "",
      password: "",

      validator: {
        email: [(v: string) => /^.+@.+$/.test(v) || "Invalid email address"],
        password: [
          (v: string) => /[A-Z]/.test(v) || "Upper case letter required",
          (v: string) => /[a-z]/.test(v) || "Lower case letter required",
          (v: string) => /\d/.test(v) || "Digit required",
          (v: string) => v.length > 6 || "Minimum six characters"
        ]
      },

      snackbar: {
        show: false,
        text: ""
      }
    };
  },

  methods: {
    showSnackbar(text: string) {
      this.snackbar.text = text;
      this.snackbar.show = true;
    },

    logIn() {
      this.$apollo
        .mutate<LogIn>({
          mutation: LOGIN,
          variables: {
            credentials: {
              email: this.email,
              password: this.password
            }
          } as LogInVariables
        })
        .then(response => {
          this.$store.commit("logIn", response.data!.login);
          this.$router.push({ name: "entries" });
        })
        .catch(() => {
          this.$store.commit("logOut");
          this.showSnackbar("Invalid credentials; please try again.");
        });
    }
  }
});
</script>
