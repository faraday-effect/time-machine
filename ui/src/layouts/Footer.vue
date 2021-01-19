<template>
  <v-footer app>
    <span class="title text-uppercase font-weight-light"> Faraday </span>
    <v-spacer />
    <span class="caption text-uppercase">
      &copy; Copyright 2020&ndash;{{ theYear }} Tom Nurkkala
    </span>
  </v-footer>
</template>

<script lang="ts">
export default {
  name: "Footer",

  computed: {
    theYear() {
      return new Date().getFullYear();
    },
  },
};
</script>
