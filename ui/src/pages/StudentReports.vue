<template>
  <v-container>
    <v-row>
      <v-col>
        <group-by
          title="Time By Project"
          :entries="allEntries"
          group-heading="Project"
          iteratee="project.title"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Entries } from "@/models/entry.model";
import GroupBy from "@/components/GroupBy.vue";
import {
  EntriesByAccount,
  EntriesByAccountVariables
} from "@/graphql/types/EntriesByAccount";
import { ENTRIES_BY_ACCOUNT, READ_ENTRIES } from "@/graphql/entries.graphql";

export default Vue.extend({
  name: "StudentReports",

  components: {
    GroupBy
  },

  data() {
    return {
      selectedEntries: {} as Entries,

      snackbar: {
        visible: false,
        content: ""
      }
    };
  },

  methods: {
    getEntries() {
      // Defined this way to allow type-safe use of `this.$store`.
      this.$apollo
        .query<EntriesByAccount, EntriesByAccountVariables>({
          query: ENTRIES_BY_ACCOUNT,
          variables: { accountId: this.$store.state.claims.id }
        })
        .then(
          result =>
            (this.selectedEntries = new Entries(
              result.data.readEntriesByAccount
            ))
        )
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
