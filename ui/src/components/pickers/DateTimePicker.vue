<template>
  <div id="picker">
    <h1 class="title mb-4">{{ title }}</h1>
    <date-picker-dialog label="Date" v-model="date" />
    <time-picker-dialog label="Time" v-model="time" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DatePickerDialog from "@/components/pickers/DatePickerDialog.vue";
import TimePickerDialog from "@/components/pickers/TimePickerDialog.vue";
import { DateTime } from "luxon";
import { formatDate, formatTime } from "@/helpers/time-and-date";

export default Vue.extend({
  name: "DateTimePicker",

  components: {
    DatePickerDialog,
    TimePickerDialog,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      date: "",
      time: "",
    };
  },

  methods: {
    onUpdate() {
      let iso: string;
      if (this.time) {
        if (this.date) {
          iso = `${this.date}T${this.time}`;
        } else {
          iso = this.time;
        }
      } else {
        iso = this.date;
      }
      if (iso) {
        this.$emit("input", iso);
      }
    },
  },

  created() {
    this.$watch(
      "value",
      function (newDateTime) {
        if (newDateTime) {
          const dt = DateTime.fromISO(newDateTime);
          this.date = formatDate(dt);
          this.time = formatTime(dt);
        } else {
          this.date = this.time = "";
        }
      },
      { immediate: true }
    );

    this.$watch("date", function (newDate) {
      this.date = newDate;
      this.onUpdate();
    });

    this.$watch("time", function (newTime) {
      this.time = newTime;
      if (!this.date) {
        this.date = DateTime.local().toISODate();
      }
      this.onUpdate();
    });
  },
});
</script>
