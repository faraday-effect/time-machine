<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="4">
        <date-time-picker title="Start Time" v-model="startDateTime" />
      </v-col>

      <v-col cols="12" sm="4">
        <date-time-picker title="Stop Time" v-model="stopDateTime" />
      </v-col>

      <v-col cols="12" sm="4">
        <duration :minutes="minutes" :warning="warning" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import DateTimePicker from "@/components/pickers/DateTimePicker.vue";
import Duration from "@/components/Duration.vue";
import {
  yearsDaysHoursMinutes,
  minutesBetween,
  nowDateTime,
} from "@/helpers/time-and-date";
import {
  EntryStartStop,
  MAX_MINUTES,
} from "@/components/pickers/entry-entities";

export default Vue.extend({
  name: "StartStopPicker",

  components: {
    DateTimePicker,
    Duration,
  },

  props: {
    value: {} as () => EntryStartStop,
  },

  data() {
    return {
      startDateTime: "",
      stopDateTime: "",
    };
  },

  created() {
    this.$watch(
      function () {
        return this.startDateTime + this.stopDateTime;
      },
      function () {
        this.$emit("input", {
          startDateTime: this.startDateTime,
          stopDateTime: this.stopDateTime,
          minutes: this.minutes,
          valid: this.isValid,
        } as EntryStartStop);
      }
    );

    this.$watch(
      "value",
      function (newValue) {
        const now = nowDateTime(); // Get time once to maintain consistency.
        this.startDateTime = newValue.startDateTime || now;
        this.stopDateTime = newValue.stopDateTime || now;
      },
      { immediate: true }
    );
  },

  computed: {
    minutes(): number {
      if (this.startDateTime && this.stopDateTime) {
        return minutesBetween(this.startDateTime, this.stopDateTime);
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
        return `Duration (${yearsDaysHoursMinutes(this.minutes)}) is too long`;
      } else {
        return "";
      }
    },

    isValid(): boolean {
      return (
        this.startDateTime.length > 0 &&
        this.stopDateTime.length > 0 &&
        this.minutes > 0 &&
        this.minutes < MAX_MINUTES
      );
    },
  },
});
</script>
