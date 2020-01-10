<template>
  <div id="picker">
    <h1 class="title mb-4">{{ title }}</h1>
    <date-picker-dialog label="Date" :value="date" @input="setDate" />
    <time-picker-dialog label="Time" :value="time" @input="setTime" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DatePickerDialog from "@/components/dialogs/DatePickerDialog.vue";
import TimePickerDialog from "@/components/dialogs/TimePickerDialog.vue";
import { DateTime } from "luxon";

export default Vue.extend({
  name: "DateTimePicker",

  components: {
    DatePickerDialog,
    TimePickerDialog
  },

  props: {
    title: { type: String, required: true },
    value: { type: String }
  },

  data() {
    return {
      date: "",
      time: ""
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

    setDate(newDate: string) {
      this.date = newDate;
      this.onUpdate();
    },

    setTime(newTime: string) {
      this.time = newTime;
      if (!this.date) {
        this.date = DateTime.local().toISODate();
      }
      this.onUpdate();
    }
  },

  watch: {
    value: {
      handler(val) {
        const dt = DateTime.fromISO(val);
        this.date = dt.toISODate();
        this.time = dt.toISOTime({
          suppressSeconds: true,
          includeOffset: false
        });
      }
    }
  }
});
</script>

<style scoped>
div#picker {
  padding: 20px;
  background-color: #eee;
}
</style>
