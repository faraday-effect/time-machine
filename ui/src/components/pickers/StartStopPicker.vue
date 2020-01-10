<template>
  <v-row>
    <v-col cols="12" sm="4">
      <date-time-picker title="Start Time" v-model="startDateTime" />
    </v-col>
    <v-col cols="12" sm="4">
      <date-time-picker title="End Time" v-model="endDateTime" />
    </v-col>
    <v-col cols="12" sm="4">
      <duration :minutes="minutes" :warning="warning" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { DateTime } from "luxon";
import DateTimePicker from "@/components/pickers/DateTimePicker.vue";
import Duration from "@/components/Duration.vue";
import { hoursMinutes } from "@/components/helpers";

const MAX_MINUTES = 16 * 60;

export default Vue.extend({
  name: "TimeEntryCard",

  components: {
    DateTimePicker,
    Duration
  },

  data() {
    return {
      startDateTime: "",
      endDateTime: ""
    };
  },

  computed: {
    minutes(): number {
      if (this.startDateTime && this.endDateTime) {
        const start = DateTime.fromISO(this.startDateTime);
        const end = DateTime.fromISO(this.endDateTime);
        return end.diff(start).as("minutes");
      } else {
        return 0;
      }
    },

    warning(): string {
      if (this.minutes === 0) {
        return "No duration";
      } else if (this.minutes < 0) {
        return "End time precedes start time";
      } else if (this.minutes > MAX_MINUTES) {
        return `Duration (${hoursMinutes(this.minutes)}) is too long`;
      } else {
        return "";
      }
    },

    isValidRange(): boolean {
      return (
        this.startDateTime.length > 0 &&
        this.endDateTime.length > 0 &&
        this.minutes > 0 &&
        this.minutes < MAX_MINUTES
      );
    }
  }
});
</script>
