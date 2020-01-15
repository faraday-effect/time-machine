<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h1 class="title">Time Log</h1>
        <v-spacer />
        <v-btn color="primary" @click="dialogVisible = true">
          Add Entry
        </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="allEntries">
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.start }}</td>
            <td>{{ item.stop }}</td>
            <td>{{ item.description }}</td>
            <td>
              <v-btn icon class="mr-3" @click="updateEntry(item.id)">
                <v-icon>mdi-pencil-outline</v-icon>
              </v-btn>
              <v-btn icon @click="deleteEntry(item.id)">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <time-entry-dialog
      v-model="dialogVisible"
      :initial-entry="entry"
      @result="createEntry"
    />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Entry } from "@/components/pickers/entry-entities";
import {
  ALL_ENTRIES,
  CREATE_ENTRY,
  DELETE_ENTRY
} from "@/graphql/entries.graphql";
import TimeEntryDialog from "@/components/dialogs/TimeEntryDialog.vue";
import { DeleteEntry, DeleteEntryVariables } from "@/graphql/types/DeleteEntry";
import { AllEntries_allEntries } from "@/graphql/types/AllEntries";

export default Vue.extend({
  name: "Entry",

  components: {
    TimeEntryDialog
  },

  apollo: {
    allEntries: {
      query: ALL_ENTRIES
    }
  },

  data() {
    return {
      allEntries: [] as AllEntries_allEntries[],

      headers: [
        { text: "Start", value: "start" },
        { text: "Stop", value: "stop" },
        { text: "Description", value: "description" },
        { text: "Actions", value: "actions", sortable: false }
      ],

      dialogVisible: false,

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
  },

  methods: {
    createEntry(entry: Entry) {
      this.entry = entry;

      this.$apollo
        .mutate({
          mutation: CREATE_ENTRY,
          variables: {
            createInput: {
              start: entry.startStop.startDateTime,
              stop: entry.startStop.stopDateTime,
              description: entry.description
            }
          }
        })
        .then(result => this.allEntries.push(result.data.createEntry))
        .catch(error => console.log("ERROR", error));
    },

    updateEntry(entryId: number) {},

    deleteEntry(entryId: number) {
      this.$apollo
        .mutate<DeleteEntry>({
          mutation: DELETE_ENTRY,
          variables: {
            id: entryId
          } as DeleteEntryVariables
        })
        .then(() => {
          const idx = this.allEntries.findIndex(elt => elt.id === entryId);
          this.allEntries.splice(idx, 1);
        })
        .catch(error => console.error(error));
    }
  }
});
</script>
