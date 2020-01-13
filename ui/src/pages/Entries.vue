<template>
  <v-container>
    <v-row>
      <v-col>
        <time-entry-form v-model="entry" />
        <v-data-table :headers="headers" :items="allEntries" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TimeEntryForm from "@/components/forms/TimeEntryForm.vue";
import { Entry } from "@/components/pickers/entry-entities";
import { ALL_ENTRIES } from "@/graphql/entries.graphql";

export default Vue.extend({
  name: "Entry",

  components: {
    TimeEntryForm
  },

  apollo: {
    allEntries: {
      query: ALL_ENTRIES
    }
  },

  data() {
    return {
      headers: [
        { text: "Start", value: "start" },
        { text: "Stop", value: "stop" },
        { text: "Description", value: "description" }
      ],

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
