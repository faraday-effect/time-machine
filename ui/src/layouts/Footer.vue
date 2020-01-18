<template>
  <v-footer app>
    <v-spacer />
    <h6 class="caption">
      &copy; Copyright {{ new Date().getFullYear() }} by Tom Nurkkala
    </h6>
  </v-footer>
</template>

<script lang="ts">
export default {
  name: "Footer"
};
</script>
