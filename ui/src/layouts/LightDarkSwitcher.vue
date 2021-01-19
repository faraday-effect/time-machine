<template>
  <v-btn text @click="flipSwitch">
    <v-icon>{{ currentIcon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "LightDarkSwitcher",

  data: () => ({
    dark: false,
  }),

  computed: {
    currentIcon() {
      return this.dark ? "mdi-lightbulb-on" : "mdi-lightbulb-off";
    },
  },

  methods: {
    flipSwitch() {
      this.dark = !this.dark;
      this.$vuetify.theme.dark = this.dark;
    },
  },
});
</script>

<style scoped></style>
