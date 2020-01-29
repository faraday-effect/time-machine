<template>
  <v-data-table :headers="headers" :items="projectSummaries">
    <template v-slot:item.duration="{ item }">
      {{ item.totalMinutes | formatTime }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { PROJECT_SUMMARIES } from "@/graphql/projects.graphql";
import { hoursMinutes } from "@/helpers/time-and-date";

export default Vue.extend({
  name: "ProjectSummaryTable",

  apollo: {
    projectSummaries: {
      query: PROJECT_SUMMARIES
    }
  },

  data() {
    return {
      headers: [
        { text: "Title", value: "title" },
        { text: "Entries", value: "entryCount", align: "end" },
        { text: "Minutes", value: "totalMinutes", align: "end" },
        { text: "Duration", value: "duration", align: "end", sortable: false }
      ]
    };
  },

  filters: {
    formatTime(minutes: number) {
      return hoursMinutes(minutes);
    }
  }
});
</script>
