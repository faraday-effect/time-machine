<template>
  <v-dialog
    ref="dialog"
    v-model="isOpen"
    :return-value.sync="time"
    width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :label="label"
        :value="time"
        @input="$emit('input', $event)"
        prepend-icon="mdi-clock-outline"
        readonly
        v-on="on"
      />
    </template>
    <v-time-picker v-model="time" scrollable ampm-in-title>
      <v-spacer />
      <v-btn text color="primary" @click="isOpen = false">Cancel</v-btn>
      <v-btn text color="primary" @click="onOkay">Ok</v-btn>
    </v-time-picker>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TimePickerDialog",

  props: {
    label: {
      type: String,
      default: "Choose a time"
    },
    value: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      time: this.value,
      isOpen: false
    };
  },

  methods: {
    onOkay() {
      (this.$refs.dialog as any).save(this.time);
      this.$emit("input", this.time);
    }
  },

  watch: {
    value(newVal) {
      this.time = newVal;
    }
  }
});
</script>
