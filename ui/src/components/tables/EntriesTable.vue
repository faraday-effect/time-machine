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
import { ReadEntries_readEntries as GqlEntry } from "@/graphql/types/ReadEntries";

export default Vue.extend({
  name: "EntriesTable",

  components: {
    ActionIcons
  },

  props: {
    showActions: {
      type: Boolean,
      default: true
    },
    entries: {
      type: Array as () => GqlEntry[],
      required: true
    },
    chronologicalOrder: {
      type: Boolean,
      default: false
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
    sortedEntries(): GqlEntry[] {
      const sorted = sortBy(this.entries, elt => elt.start);
      if (!this.chronologicalOrder) {
        return sorted.reverse();
      }
      return sorted;
    }
  },

  methods: {
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
