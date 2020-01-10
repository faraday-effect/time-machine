<template>
  <div>
    <start-stop-picker />
    <v-spacer />
    <v-btn text>Cancel</v-btn>
    <v-btn text color="success">Submit</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import StartStopPicker from "@/components/pickers/StartStopPicker.vue";

export default Vue.extend({
  name: "TimeEntryForm",

  components: {
    StartStopPicker
  }
});
</script>
