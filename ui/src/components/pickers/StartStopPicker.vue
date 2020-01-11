<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="4">
        <date-time-picker
          title="Start Time"
          :value="value.start"
          @input="update('start', $event)"
        />
      </v-col>

      <v-col cols="12" sm="4">
        <date-time-picker
          title="Stop Time"
          :value="value.stop"
          @input="update('stop', $event)"
        />
      </v-col>

      <v-col cols="12" sm="4">
        <duration :minutes="minutes" />
        <!--        :warning="warning" />-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import DateTimePicker from "@/components/pickers/DateTimePicker.vue";
import Duration from "@/components/Duration.vue";
import { DateTime } from "luxon";

// const MAX_MINUTES = 16 * 60;

export default Vue.extend({
  name: "StartStopPicker",

  components: {
    DateTimePicker,
    Duration
  },

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  methods: {
    update(key: string, value: string) {
      this.$emit("input", { ...this.value, [key]: value });
    }
  },

  computed: {
    minutes(): number {
      if (this.startDateTime && this.stopDateTime) {
        const start = DateTime.fromISO(this.startDateTime);
        const end = DateTime.fromISO(this.stopDateTime);
        return end.diff(start).as("minutes");
      } else {
        return 0;
    }

    //   warning(): string {
    //     if (this.minutes === 0) {
    //       return "No duration";
    //     } else if (this.minutes < 0) {
    //       return "End time precedes start time";
    //     } else if (this.minutes > MAX_MINUTES) {
    //       return `Duration (${hoursMinutes(this.minutes)}) is too long`;
    //     } else {
    //       return "";
    //     }
    //   },
    //
    //   isValid(): boolean {
    //     return (
    //       this.startDateTime.length > 0 &&
    //       this.stopDateTime.length > 0 &&
    //       this.minutes > 0 &&
    //       this.minutes < MAX_MINUTES
    //     );
    //   }
  }
});
</script>

// Super helpful:
https://simonkollross.de/posts/vuejs-using-v-model-with-objects-for-custom-components
