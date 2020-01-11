<template>
  <div id="picker">
    <h1 class="title mb-4">{{ title }}</h1>

    <date-picker-dialog
      label="Date"
      :value="value.date"
      @input="update('date', $event)"
    />

    <time-picker-dialog
      label="Time"
      :value="value.time"
      @input="update('time', $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DatePickerDialog from "@/components/pickers/DatePickerDialog.vue";
import TimePickerDialog from "@/components/pickers/TimePickerDialog.vue";

export default Vue.extend({
  name: "DateTimePicker",

  components: {
    DatePickerDialog,
    TimePickerDialog
  },

  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: Object,
      required: true
    }
  },

  methods: {
    update(key: string, value: string) {
      this.$emit("input", { ...this.value, [key]: value });
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
