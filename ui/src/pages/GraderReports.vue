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
            <account-summary-table />
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
import GroupBy from "@/components/GroupBy.vue";
import {
  ReadEntries,
  ReadEntries_readEntries as GqlEntry
} from "@/graphql/types/ReadEntries";
import { READ_ENTRIES } from "@/graphql/entries.graphql";
import EntriesTable from "@/components/tables/EntriesTable.vue";
import ProjectSummaryTable from "@/components/tables/ProjectSummaryTable.vue";
import AccountSummaryTable from "@/components/tables/AccountSummaryTable.vue";

export default Vue.extend({
  name: "GraderReports",

  components: {
    EntriesTable,
    ProjectSummaryTable,
    AccountSummaryTable
  },

  data() {
    return {
      gqlAllEntries: [] as GqlEntry[],

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
    getEntries() {
      // Defined this way to allow type-safe use of `this.$store`.
      this.$apollo
        .query<ReadEntries>({
          query: READ_ENTRIES
        })
        .then(result => (this.gqlAllEntries = result.data.readEntries))
        .catch(error => this.showSnackbar(error));
    },

    showSnackbar(content: string) {
      this.snackbar.content = content;
      this.snackbar.visible = true;
    }
  },

  mounted() {
    this.getEntries();
  }
});
</script>
