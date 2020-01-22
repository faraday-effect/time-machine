<template>
  <v-dialog :value="value" persistent max-width="800">
    <v-card>
      <v-card-title></v-card-title>

      <v-card-text>
        <v-form v-model="formValid">
          <!-- Form fields here -->
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="onClose">Cancel</v-btn>
        <v-btn text color="success" :disabled="!formValid" @click="onSubmit">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { CreateRole_newRole as Role } from "@/graphql/types/CreateRole";

export default Vue.extend({
  name: "RoleDialog",

  props: {
    value: { type: Boolean, required: true },
    title: { type: String, required: true },
    role: { type: Object as () => Role }
  },

  data() {
    return {
      form: {
        // Form models here.
      } as Role,

      formValid: false,
      required: [(v: string) => !!v || "Required field"]
    };
  },

  methods: {
    onClose() {
      this.$emit("input", false);
    },

    onSubmit() {
      this.$emit("ready", this.form);
      this.$emit("input", false);
    }
  },

  watch: {
    role: {
      handler(newValue: Role) {
        this.form = { ...newValue }; // Don't clobber parent.
      },
      immediate: true
    }
  }
});
</script>
