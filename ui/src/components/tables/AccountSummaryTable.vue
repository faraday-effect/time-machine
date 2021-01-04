<template>
  <v-data-table
    :headers="headers"
    :items="accountSummaries"
    @click:row="onRowClick"
  >
    <template v-slot:item.duration="{ item }">
      {{ item.totalMinutes | formatTime }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { ACCOUNT_SUMMARIES } from "@/graphql/accounts.graphql";
import { hoursMinutes } from "@/helpers/time-and-date";
import { AccountSummaries_accountSummaries as AccountSummary } from "@/graphql/types/AccountSummaries";

export default Vue.extend({
  name: "AccountSummaryTable",

  apollo: {
    accountSummaries: {
      query: ACCOUNT_SUMMARIES,
    },
  },

  data() {
    return {
      accountSummaries: [] as AccountSummary[],

      headers: [
        { text: "First Name", value: "firstName" },
        { text: "Last Name", value: "lastName" },
        { text: "Entries", value: "entryCount", align: "end" },
        { text: "Minutes", value: "totalMinutes", align: "end" },
        { text: "Duration", value: "duration", align: "end", sortable: false },
      ],
    };
  },

  methods: {
    onRowClick(row: AccountSummary) {
      this.$emit("click", row);
    },
  },

  filters: {
    formatTime(minutes: number) {
      return hoursMinutes(minutes);
    },
  },
});
</script>
