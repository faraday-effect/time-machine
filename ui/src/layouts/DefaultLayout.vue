<template>
  <v-app>
    <app-bar />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AppBar from "@/layouts/AppBar.vue";

export default Vue.extend({
  name: "DefaultLayout",

  components: {
    AppBar
  }
});
</script>
