<template>
  <v-dialog :value="value" persistent max-width="800">
    <v-card>
      <v-card-title>Enter Time</v-card-title>

      <v-card-text>
        <time-entry-form v-model="entry" @valid="canSubmit = $event" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn text color="success" :disabled="!canSubmit" @click="onSubmit">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import TimeEntryForm from "@/components/forms/TimeEntryForm.vue";
import { Entry } from "@/components/pickers/entry-entities";

export default Vue.extend({
  name: "TimeEntryDialog",

  components: { TimeEntryForm },

  props: {
    value: { type: Boolean, required: true },
    initialEntry: {} as () => Entry,
  },

  data() {
    return {
      canSubmit: false,
      entry: {} as Entry,
    };
  },

  methods: {
    close() {
      this.$emit("input", false);
    },

    onSubmit() {
      this.$emit("result", this.entry);
      this.close();
    },
  },

  watch: {
    initialEntry: {
      handler(newValue) {
        this.entry = { ...newValue };
      },
      immediate: true,
    },
  },
});
</script>
