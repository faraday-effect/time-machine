<template>
  <v-container>
    <v-row>
      <v-col>
        <time-entry-form v-model="entry" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TimeEntryForm from "@/components/forms/TimeEntryForm.vue";
import { Entry } from "@/components/pickers/entry-entities";

export default Vue.extend({
  name: "Entry",

  components: {
    TimeEntryForm
  },

  data() {
    return {
      entry: {
        startStop: {
          valid: false,
          startDateTime: "",
          stopDateTime: "",
          minutes: 0
        },
        description: ""
      } as Entry
    };
  }
});
</script>
