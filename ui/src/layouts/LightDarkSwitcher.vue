<template>
  <v-btn text @click="flipSwitch">
    <v-icon>{{ currentIcon }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";
import { mapMutations, mapState } from "vuex";

export default Vue.extend({
  name: "LightDarkSwitcher",

  computed: {
    ...mapState(["darkMode"]),
    currentIcon(): string {
      return this.darkMode ? "mdi-lightbulb-on" : "mdi-lightbulb-off";
    },
  },

  methods: {
    ...mapMutations(["setDarkMode"]),
    flipSwitch() {
      const newValue = !this.darkMode;
      this.setDarkMode(newValue);
      this.$vuetify.theme.dark = newValue;
    },
  },
});
</script>
