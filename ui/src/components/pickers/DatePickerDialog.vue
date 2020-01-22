<template>
  <v-dialog
    ref="dialog"
    v-model="isOpen"
    :return-value.sync="date"
    width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :label="label"
        :value="date"
        @input="$emit('input', $event)"
        prepend-icon="mdi-calendar-outline"
        readonly
        v-on="on"
      />
    </template>
    <v-date-picker v-model="date" scrollable>
      <v-spacer />
      <v-btn text color="primary" @click="isOpen = false">Cancel</v-btn>
      <v-btn text color="primary" @click="onOkay">Ok</v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "DatePickerDialog",

  props: {
    label: {
      type: String,
      default: "Choose a date"
    },
    value: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      date: this.value,
      isOpen: false
    };
  },

  methods: {
    onOkay() {
      (this.$refs.dialog as any).save(this.date);
      this.$emit("input", this.date);
    }
  },

  watch: {
    value(newVal) {
      this.date = newVal;
    }
  }
});
</script>
