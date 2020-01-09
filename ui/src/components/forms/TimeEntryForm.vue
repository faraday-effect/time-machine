<template>
  <v-card>
    <v-card-title>Enter Time</v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <date-picker-dialog v-model="startDate" label="Start date" />
          </v-col>
          <v-col>
            <time-picker-dialog v-model="startTime" label="Start time" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <date-picker-dialog v-model="endDate" label="End date" />
          </v-col>
          <v-col>
            <time-picker-dialog v-model="endTime" label="End time" />
          </v-col>
        </v-row>
      </v-container>

      <div>{{ startDateTime }} to {{ endDateTime }} is {{ duration }}</div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text>Cancel</v-btn>
      <v-btn text color="success">Submit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import DatePickerDialog from "@/components/dialogs/DatePickerDialog.vue";
import TimePickerDialog from "@/components/dialogs/TimePickerDialog.vue";

export default Vue.extend({
  name: "TimeEntryForm",

  components: {
    DatePickerDialog,
    TimePickerDialog
  },

  data() {
    return {
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: ""
    };
  },

  computed: {
    startDateTime(): string {
      return `${this.startDate} ${this.startTime}`;
    },

    endDateTime(): string {
      return `${this.endDate} ${this.endTime}`;
    },

    duration(): string {
      return "NOT SURE";
    }
  },

  watch: {
    // Unless it's already set, set the end date to the start date
    // when the start date changes.
    startDate(val) {
      if (!this.endDate.length) {
        this.endDate = val;
      }
    }
  }
});
</script>
