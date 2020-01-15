<template>
  <v-container>
    <v-card>
      <v-card-title>
        <h1 class="title">Time Log</h1>
        <v-spacer />
        <v-btn color="primary" @click="showCreateDialog">
          Add Entry
        </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="allEntries">
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.start | formatDateTime }}</td>
            <td>{{ maybeShortenDateTime(item) }}</td>
            <td>{{ duration(item) }}</td>
            <td>{{ item.description }}</td>
            <td>
              <v-btn icon class="mr-3" @click="showUpdateDialog(item)">
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
      v-model="dialog.visible"
      :initial-entry="dialog.uiEntry"
      @result="onResult"
    />

    <v-snackbar v-model="snackbar.visible">
      {{ snackbar.content }}
      <v-btn text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Entry } from "@/components/pickers/entry-entities";
import {
  ALL_ENTRIES,
  CREATE_ENTRY,
  DELETE_ENTRY,
  UPDATE_ENTRY
} from "@/graphql/entries.graphql";
import TimeEntryDialog from "@/components/dialogs/TimeEntryDialog.vue";
import { DeleteEntry, DeleteEntryVariables } from "@/graphql/types/DeleteEntry";
import { AllEntries_allEntries as GqlEntry } from "@/graphql/types/AllEntries";
import { EntryCreateInput } from "@/graphql/types/globalTypes";
import { CreateEntry } from "@/graphql/types/CreateEntry";
import {
  fancyDateTime,
  fancyTime,
  minutesBetween,
  sameDate,
  yearsDaysHoursMinutes
} from "@/helpers/time-and-date";

enum DialogMode {
  CREATE,
  UPDATE
}

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
      allEntries: [] as GqlEntry[],

      headers: [
        { text: "Start", value: "start" },
        { text: "Stop", value: "stop" },
        { text: "Duration", value: "duration" },
        { text: "Description", value: "description" },
        { text: "Actions", value: "actions", sortable: false }
      ],

      dialog: {
        visible: false,
        mode: DialogMode.CREATE,
        uiEntry: {} as Entry
      },

      snackbar: {
        visible: false,
        content: ""
      }
    };
  },

  methods: {
    showSnackbar(content: string) {
      this.snackbar.content = content;
      this.snackbar.visible = true;
    },

    duration(entry: GqlEntry) {
      return yearsDaysHoursMinutes(minutesBetween(entry.start, entry.stop));
    },

    maybeShortenDateTime(entry: GqlEntry) {
      if (sameDate(entry.start, entry.stop)) {
        return fancyTime(entry.stop);
      } else {
        return fancyDateTime(entry.stop);
      }
    },

    showCreateDialog() {
      this.dialog.uiEntry = {
        startStop: {
          valid: false,
          startDateTime: "",
          stopDateTime: "",
          minutes: 0
        },
        description: ""
      } as Entry;

      this.dialog.gqlEntry = null;

      this.dialog.mode = DialogMode.CREATE;
      this.dialog.visible = true;
    },

    showUpdateDialog(gqlEntry: GqlEntry) {
      this.dialog.uiEntry = {
        startStop: {
          valid: true,
          startDateTime: gqlEntry.start,
          stopDateTime: gqlEntry.stop,
          minutes: 0
        },
        description: gqlEntry.description
      } as Entry;

      this.dialog.mode = DialogMode.UPDATE;
      this.dialog.visible = true;
    },

    onResult(uiEntry: Entry) {
      switch (this.dialog.mode) {
        case DialogMode.CREATE:
          this.createEntry(uiEntry);
          break;
        case DialogMode.UPDATE:
          this.updateEntry(uiEntry);
          break;
        default:
          throw Error(`Bogus dialog mode '${this.dialog.mode}'`);
      }
    },

    createEntry(entry: Entry) {
      this.$apollo
        .mutate<CreateEntry>({
          mutation: CREATE_ENTRY,
          variables: {
            createInput: {
              start: entry.startStop.startDateTime,
              stop: entry.startStop.stopDateTime,
              description: entry.description
            } as EntryCreateInput
          }
        })
        .then(result => {
          this.allEntries.push(result.data!.createEntry);
          this.showSnackbar("Added time entry");
        })
        .catch(error => this.showSnackbar(error));
    },

    updateEntry(uiEntry: Entry) {
      this.$apollo
        .mutate({
          mutation: UPDATE_ENTRY,
          variables: {
            updateInput: uiEntry
          }
        })
        .then(result => this.showSnackbar(JSON.stringify(result)))
        .catch(error => this.showSnackbar(error));
    },

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
          this.showSnackbar("Deleted time entry");
        })
        .catch(error => this.showSnackbar(error));
    }
  },

  filters: {
    formatDateTime(dt: string) {
      return fancyDateTime(dt);
    }
  }
});
</script>
