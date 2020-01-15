<template>
  <div id="picker">
    <h1 class="title mb-4">Duration</h1>
    <v-alert type="warning" v-if="warning">
      {{ warning }}
    </v-alert>
    <div v-else>
      <h2 class="body-1">{{ hrMin }}</h2>
      <h2 class="body-1">{{ minutes }} minutes</h2>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { yearsDaysHoursMinutes } from "@/helpers/time-and-date";

export default Vue.extend({
  name: "Duration",

  props: {
    minutes: { type: Number, required: true },
    warning: { type: String }
  },

  computed: {
    hrMin() {
      return yearsDaysHoursMinutes(this.minutes);
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
