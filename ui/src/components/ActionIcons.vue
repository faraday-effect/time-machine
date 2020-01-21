<template>
  <div>
    <v-btn icon class="mr-1" @click="$emit('update')">
      <v-icon>mdi-pencil-outline</v-icon>
    </v-btn>
    <v-btn icon @click="$emit('delete')">
      <v-icon>mdi-delete-outline</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ActionIcons"
});
</script>
