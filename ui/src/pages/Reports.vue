<template>
  <v-container>
    <v-row>
      <v-col>
        <ul>
          <li v-for="entry in allEntries.entries" :key="entry.id">
            {{ entry.account.fullName }}
            {{ entry.project.title }}
            {{ entry.start }} {{ entry.stop }} {{ entry.duration }}
          </li>
          <li>
            {{ allEntries.minutes }}
            {{ allEntries.duration }}
          </li>
        </ul>
        <ul>
          <li v-for="entry in allEntries.byProject" :key="entry.id">
            {{ entry }}
          </li>
        </ul>
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

export default Vue.extend({
  name: "Reports",

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
