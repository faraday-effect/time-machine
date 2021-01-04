<template>
  <div>
    <v-btn icon class="mr-1" :disabled="!canUpdate" @click="$emit('update')">
      <v-icon>mdi-pencil-outline</v-icon>
    </v-btn>
    <v-btn icon :disabled="!canDelete" @click="$emit('delete')">
      <v-icon>mdi-delete-outline</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ActionIcons",

  props: {
    canUpdate: { type: Boolean, default: true },
    canDelete: { type: Boolean, default: true },
  },
});
</script>
