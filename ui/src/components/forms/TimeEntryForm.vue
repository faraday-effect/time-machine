<template>
  <v-card>
    <v-card-title>Enter Time</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <date-time-picker title="Start Time" v-model="startDateTime" />
          </v-col>
          <v-col>
            <date-time-picker title="End Time" v-model="endDateTime" />
          </v-col>
          <v-col>
            <duration :minutes="minutes" :warning="warning" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text>Cancel</v-btn>
      <v-btn text color="success" :disabled="!isValidRange">Submit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { DateTime } from "luxon";
import DateTimePicker from "@/components/DateTimePicker.vue";
import Duration from "@/components/Duration.vue";
import { hoursMinutes } from "@/components/helpers";

const MAX_MINUTES = 16 * 60;

export default Vue.extend({
  name: "TimeEntryForm",

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
  },

  watch: {
    // Unless it's already set, set the end to the start when the start updates.
    startDateTime(val) {
      if (!this.endDateTime) {
        this.endDateTime = val;
      }
    }
  }
});
</script>
