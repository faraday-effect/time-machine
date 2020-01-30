<template>
  <v-container>
    <v-row>
      <v-col>
        <v-tabs v-model="currentTab">
          <v-tab>By Project</v-tab>
          <v-tab>By Account</v-tab>
          <v-tab>Entries</v-tab>

          <v-tab-item>
            <project-summary-table />
          </v-tab-item>

          <v-tab-item>
            <account-summary-table @click="onAccountClick" />
          </v-tab-item>

          <v-tab-item>
            <entries-table
              :entries="gqlAllEntries"
              :chronological-order="false"
              :show-actions="false"
            />
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Entries } from "@/models/entry.model";
import { AccountSummaries_accountSummaries as AccountSummary } from "@/graphql/types/AccountSummaries";
import {
  ReadEntries,
  ReadEntries_readEntries as GqlEntry
} from "@/graphql/types/ReadEntries";
import { ENTRIES_BY_ACCOUNT, READ_ENTRIES } from "@/graphql/entries.graphql";
import EntriesTable from "@/components/tables/EntriesTable.vue";
import ProjectSummaryTable from "@/components/tables/ProjectSummaryTable.vue";
import AccountSummaryTable from "@/components/tables/AccountSummaryTable.vue";
import {
  EntriesByAccount,
  EntriesByAccountVariables
} from "@/graphql/types/EntriesByAccount";

export default Vue.extend({
  name: "GraderReports",

  components: {
    ProjectSummaryTable,
    AccountSummaryTable,
    EntriesTable
  },

  data() {
    return {
      selectedEntries: Entries,

      currentTab: null,

      snackbar: {
        visible: false,
        content: ""
      }
    };
  },

  computed: {
    allEntries(): Entries {
      return new Entries(this.gqlAllEntries);
    }
  },

  methods: {
    onAccountClick(row: AccountSummary) {
      console.log("CLICKED", JSON.stringify(row, null, 2));
      this.$apollo
        .query<EntriesByAccount, EntriesByAccountVariables>({
          query: ENTRIES_BY_ACCOUNT,
          variables: { accountId: row.accountId }
        })
        .then(
          result =>
            (this.selectedEntries = new Entries(result.data.readEntriesByAccount))
        );
    },

    showSnackbar(content: string) {
      this.snackbar.content = content;
      this.snackbar.visible = true;
    }
  }
});
</script>
