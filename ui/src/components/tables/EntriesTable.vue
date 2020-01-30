<template>
  <v-data-table :headers="headers" :items="sortedEntries" :disable-sort="true">
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.start | formatDate }}</td>
        <td>{{ item.start | formatTime }}</td>
        <td>{{ stopTimeMaybeDate(item) }}</td>
        <td class="text-right">{{ duration(item) }}</td>
        <td>{{ item.project.title }}</td>
        <td>{{ item.description }}</td>
        <td v-if="showActions">
          <action-icons
            @update="showUpdateDialog(item)"
            @delete="deleteEntry(item.id)"
          />
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import {
  dayDelta,
  fancyDate,
  fancyTime,
  minutesBetween,
  yearsDaysHoursMinutes
} from "@/helpers/time-and-date";
import { sortBy } from "lodash";
import ActionIcons from "@/components/ActionIcons.vue";
import { Entries, Entry } from "@/models/entry.model";

export default Vue.extend({
  name: "EntriesTable",

  components: {
    ActionIcons
  },

  props: {
    entries: {
      type: Object as () => Entries,
      required: true
    },
    chronologicalOrder: {
      type: Boolean,
      default: false
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },

  data() {
    const headers = [
      { text: "Date" },
      { text: "Start" },
      { text: "Stop" },
      { text: "Duration", align: "end" },
      { text: "Project" },
      { text: "Description", width: "40%" }
    ];

    if (this.showActions) {
      headers.push({ text: "Actions" });
    }

    return {
      headers
    };
  },

  computed: {
    sortedEntries(): Entry[] {
      const sorted = sortBy(this.entries.entries, elt => elt.start);
      if (!this.chronologicalOrder) {
        return sorted.reverse();
      }
      return sorted;
    }
  },

  methods: {
    duration(entry: Entry) {
      return yearsDaysHoursMinutes(minutesBetween(entry.start, entry.stop));
    },

    stopTimeMaybeDate(entry: Entry) {
      const result = [fancyTime(entry.stop)];
      const delta = dayDelta(entry.start, entry.stop);
      if (delta > 0) {
        result.push(`(+${delta}d)`);
      }
      return result.join(" ");
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
