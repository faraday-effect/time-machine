<template>
  <v-app-bar app>
    <v-toolbar-title class="headline text-uppercase">
      <span>Time</span>
      <span class="font-weight-light">Machine</span>
    </v-toolbar-title>

    <v-spacer />

    <v-menu v-if="isLoggedIn" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <v-icon dark>mdi-account</v-icon>
          <span>{{ $store.state.claims.firstName }}</span>
          <v-icon dark>mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item :to="{ name: 'roles' }">
          Roles
        </v-list-item>
        <v-list-item :to="{ name: 'projects' }">
          Projects
        </v-list-item>
        <v-list-item :to="{ name: 'entries' }">
          Entries
        </v-list-item>
<!--        <v-list-item :to="{ name: 'reports' }">-->
<!--          Reports-->
<!--        </v-list-item>-->

        <v-divider />

        <v-list-item :to="{ name: 'password' }">
          <v-list-item-title>Change Password</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="logOut">
          <v-list-item-title>Log Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn text href="https://github.com/faraday-effect/time-machine">
      <v-icon color="grey">mdi-github-circle</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "AppBar",

  methods: {
    logOut() {
      this.$store.commit("logOut");
      this.$router.push({ name: "login" });
    }
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  }
});
</script>
