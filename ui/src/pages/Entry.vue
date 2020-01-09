<template>
  <v-container>
    <v-row>
      <v-col>
        <time-entry-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TimeEntryForm from "@/components/forms/TimeEntryForm.vue";

export default Vue.extend({
  name: "Entry",

  components: {
    TimeEntryForm
  }
});
</script>
