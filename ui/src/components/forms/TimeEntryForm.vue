<template>
  <v-form v-model="formValid">
    <v-row>
      <start-stop-picker
        :value="value.startStop"
        @input="update('startStop', $event)"
      />
    </v-row>
    <v-row>
      <v-col>
        <v-textarea
          :value="value.description"
          @input="update('description', $event)"
          label="Description"
          rows="2"
          auto-grow
          :rules="required"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import StartStopPicker from "@/components/pickers/StartStopPicker.vue";
import { Entry } from "@/components/pickers/entry-entities";

export default Vue.extend({
  name: "TimeEntryForm",

  components: {
    StartStopPicker
  },

  props: {
    value: {} as () => Entry
  },

  data() {
    return {
      formValid: false,
      required: [(v: string) => !!v || "Required"]
    };
  },

  methods: {
    update(key: string, value: string) {
      this.$emit("input", { ...this.value, [key]: value });
    }
  },

  created() {
    this.$watch(
      function() {
        return this.formValid && this.value.startStop.valid;
      },
      function(newValue) {
        this.$emit("valid", newValue);
      }
    );
  }
});
</script>

/* Super helpful:
https://simonkollross.de/posts/vuejs-using-v-model-with-objects-for-custom-components
*/
