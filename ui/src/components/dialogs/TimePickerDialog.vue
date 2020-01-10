<template>
  <v-dialog
    ref="dialog"
    v-model="isOpen"
    :return-value.sync="time"
    width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="time"
        :label="label"
        prepend-icon="mdi-calendar"
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
  name: "DatePickerDialog",

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
