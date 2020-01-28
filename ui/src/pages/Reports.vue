<template>
  <v-container>
    <v-row>
      <v-col>
        <group-by
          title="By Project"
          :entries="allEntries"
          group-heading="Project"
          iteratee="project.title"
        />
      </v-col>
      <v-col>
        <group-by
          title="By Account"
          :entries="allEntries"
          group-heading="Account"
          iteratee="account.fullName"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  AllEntries,
  AllEntries_allEntries as GqlEntry
} from "@/graphql/types/AllEntries";
import { ALL_ENTRIES } from "@/graphql/entries.graphql";
import { Entries } from "@/models/entry.model";
import GroupBy from "@/components/GroupBy.vue";

export default Vue.extend({
  name: "Reports",

  components: {
    GroupBy
  },

  apollo: {},

  data() {
    return {
      gqlAllEntries: [] as GqlEntry[],

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
        .query<AllEntries>({
          query: ALL_ENTRIES
        })
        .then(result => (this.gqlAllEntries = result.data.allEntries))
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
