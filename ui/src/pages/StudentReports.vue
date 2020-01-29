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
  ReadEntries,
  ReadEntries_readEntries as GqlEntry,
  ReadEntriesVariables
} from "@/graphql/types/ReadEntries";
import { READ_ENTRIES } from "@/graphql/entries.graphql";

export default Vue.extend({
  name: "StudentReports",

  components: {
    GroupBy
  },

  data() {
    return {
      gqlAccountEntries: [] as GqlEntry[],

      snackbar: {
        visible: false,
        content: ""
      }
    };
  },

  computed: {
    allEntries(): Entries {
      return new Entries(this.gqlAccountEntries);
    }
  },

  methods: {
    getEntries() {
      // Defined this way to allow type-safe use of `this.$store`.
      this.$apollo
        .query<ReadEntries, ReadEntriesVariables>({
          query: READ_ENTRIES,
          variables: {
            accountId: this.$store.state.claims.id
          }
        })
        .then(result => (this.gqlAccountEntries = result.data.readEntries))
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
