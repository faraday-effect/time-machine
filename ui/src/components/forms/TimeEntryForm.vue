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
            <div class="title">Duration</div>
            <div class="body-1">{{ duration }}</div>
          </v-col>
        </v-row>
        <v-row v-if="alert">
          <v-alert type="info">
            {{ alert }}
          </v-alert>
        </v-row>
      </v-container>

      <div>
        {{ startDateTime }} to {{ endDateTime }} is {{ duration }} minutes.
      </div>
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

export default Vue.extend({
  name: "TimeEntryForm",

  components: {
    DateTimePicker
  },

  data() {
    return {
      startDateTime: "",
      endDateTime: ""
    };
  },

  computed: {
    duration(): number | null {
      const start = DateTime.fromISO(this.startDateTime);
      const end = DateTime.fromISO(this.endDateTime);
      return start && end ? end.diff(start).as("minutes") : null;
    },

    alert(): string | null {
      if (this.duration && this.duration < 0) {
        return "NEGATIVE DURATION";
      }
      return null;
    },

    isValidRange(): boolean {
      return this.startDateTime !== null && this.endDateTime !== null;
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
