<template>
  <v-data-table :headers="headers" :items="accountSummaries">
    <template v-slot:item.duration="{ item }">
      {{ item.totalMinutes | formatTime }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { ACCOUNT_SUMMARIES } from "@/graphql/accounts.graphql";
import { hoursMinutes } from "@/helpers/time-and-date";

export default Vue.extend({
  name: "AccountSummaryTable",

  apollo: {
    accountSummaries: {
      query: ACCOUNT_SUMMARIES
    }
  },

  data() {
    return {
      headers: [
        { text: "First Name", value: "firstName" },
        { text: "Last Name", value: "lastName" },
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
