<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-data-table :headers="headers" :items="groupEntries">
      <template v-slot:body.append>
        <tr class="secondary">
          <td>Total</td>
          <td class="text-end">{{ entries.minutes }}</td>
          <td class="text-end">{{ entries.duration }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Entries } from "@/models/entry.model";

export default Vue.extend({
  name: "GroupBy",

  props: {
    title: { type: String, required: true },
    entries: { type: Object, required: true },
    groupHeading: { type: String, required: true },
    iteratee: { type: String, required: true }
  },

  computed: {
    groupEntries(): Entries[] {
      return this.entries.byGroups(this.iteratee);
    }
  },

  data() {
    return {
      headers: [
        { text: this.groupHeading, value: "groupName" },
        { text: "Minutes", value: "minutes", align: "end" },
        { text: "Duration", value: "duration", align: "end", sortable: false }
      ]
    };
  }
});
</script>
