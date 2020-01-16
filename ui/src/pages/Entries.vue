<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row class="align-baseline">
          <v-col>
            <h1 class="title">Time Log</h1>
          </v-col>
          <v-col>
            <v-switch
              class="mr-2"
              label="Newest first"
              v-model="reverseOrder"
            />
          </v-col>
          <v-col>
            <v-btn color="primary" @click="showCreateDialog">
              Add Entry
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="sortedEntries"
        :disable-sort="true"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.start | formatDate }}</td>
            <td>{{ item.start | formatTime }}</td>
            <td>{{ stopTimeMaybeDate(item) }}</td>
            <td class="text-right">{{ duration(item) }}</td>
            <td>{{ item.description }}</td>
            <td>
              <v-btn icon class="mr-1" @click="showUpdateDialog(item)">
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
import {
  EntryCreateInput,
  EntryUpdateInput
} from "@/graphql/types/globalTypes";
import { CreateEntry } from "@/graphql/types/CreateEntry";
import {
  dayDelta,
  fancyDate,
  fancyTime,
  minutesBetween,
  yearsDaysHoursMinutes
} from "@/helpers/time-and-date";
import { UpdateEntry } from "@/graphql/types/UpdateEntry";
import { sortBy } from "lodash";

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

      reverseOrder: false,

      headers: [
        { text: "Date" },
        { text: "Start" },
        { text: "Stop" },
        { text: "Duration", align: "end" },
        { text: "Description", width: "50%" },
        { text: "Actions" }
      ],

      dialog: {
        entryId: NaN,
        uiEntry: {} as Entry,
        mode: DialogMode.CREATE,
        visible: false
      },

      snackbar: {
        visible: false,
        content: ""
      }
    };
  },

  computed: {
    sortedEntries(): GqlEntry[] {
      const sorted = sortBy(this.allEntries, elt => elt.start);
      if (this.reverseOrder) {
        return sorted.reverse();
      }
      return sorted;
    }
  },

  methods: {
    showSnackbar(content: string) {
      this.snackbar.content = content;
      this.snackbar.visible = true;
    },

    duration(entry: GqlEntry) {
      return yearsDaysHoursMinutes(minutesBetween(entry.start, entry.stop));
    },

    stopTimeMaybeDate(entry: GqlEntry) {
      const result = [fancyTime(entry.stop)];
      const delta = dayDelta(entry.start, entry.stop);
      if (delta > 0) {
        result.push(`(+${delta}d)`);
      }
      return result.join(" ");
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

      this.dialog.mode = DialogMode.CREATE;
      this.dialog.visible = true;
    },

    showUpdateDialog(gqlEntry: GqlEntry) {
      this.dialog.entryId = gqlEntry.id;
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

    createEntry(uiEntry: Entry) {
      this.$apollo
        .mutate<CreateEntry>({
          mutation: CREATE_ENTRY,
          variables: {
            createInput: {
              start: uiEntry.startStop.startDateTime,
              stop: uiEntry.startStop.stopDateTime,
              description: uiEntry.description
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
        .mutate<UpdateEntry>({
          mutation: UPDATE_ENTRY,
          variables: {
            updateInput: {
              id: this.dialog.entryId,
              start: uiEntry.startStop.startDateTime,
              stop: uiEntry.startStop.stopDateTime,
              description: uiEntry.description
            } as EntryUpdateInput
          }
        })
        .then(result => {
          const updateEntry = result.data!.updateEntry;
          const idx = this.allEntries.findIndex(
            elt => elt.id === updateEntry.id
          );
          this.$set(this.allEntries, idx, updateEntry);
          this.showSnackbar("Updated time entry");
        })
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
    formatDate(dt: string) {
      return fancyDate(dt);
    },

    formatTime(dt: string) {
      return fancyTime(dt);
    }
  }
});
</script>
