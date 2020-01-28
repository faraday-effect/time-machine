<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>{{ groupHeading }}</th>
            <th>Minutes</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="groupEntry in entries.byGroups(iteratee)"
            :key="groupEntry.id"
          >
            <td>{{ groupEntry.groupName }}</td>
            <td>{{ groupEntry.minutes }}</td>
            <td>{{ groupEntry.duration }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Totals</td>
            <td>{{ entries.minutes }}</td>
            <td>{{ entries.duration }}</td>
          </tr>
        </tfoot>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "GroupBy",

  props: {
    title: { type: String, required: true },
    entries: { type: Object, required: true },
    groupHeading: { type: String, required: true },
    iteratee: { type: String, required: true }
  }
});
</script>
