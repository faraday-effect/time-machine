<template>
  <v-dialog>
    <time-entry-form
      :start-date-time="startDateTime"
      :stop-date-time="stopDateTime"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import TimeEntryForm from "@/components/forms/TimeEntryForm.vue";

export default Vue.extend({
  name: "TimeEntryDialog",

  components: { TimeEntryForm },

  data() {
    return {
      startDateTime: "",
      stopDateTIme: ""
    };
  }
});
</script>
