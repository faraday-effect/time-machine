<template>
  <v-dialog :value="value" persistent max-width="800">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <v-card-text>
        <v-form v-model="formValid">
          <v-text-field label="Title" v-model="form.title" :rules="required" />
          <v-text-field
            label="Description"
            v-model="form.description"
            :rules="required"
          />
          <v-switch label="Active" v-model="form.active" />
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
import { CreateProject_newProject as Project } from "@/graphql/types/CreateProject";

export default Vue.extend({
  name: "ProjectDialog",

  props: {
    value: { type: Boolean, required: true },
    title: { type: String, required: true },
    project: { type: Object as () => Project },
  },

  data() {
    return {
      form: {
        title: "",
        description: "",
        active: false,
      } as Project,

      formValid: false,
      required: [(v: string) => !!v || "Required field"],
    };
  },

  methods: {
    onClose() {
      this.$emit("input", false);
    },

    onSubmit() {
      this.$emit("ready", this.form);
      this.$emit("input", false);
    },
  },

  watch: {
    project: {
      handler(newValue: Project) {
        this.form = { ...newValue }; // Don't clobber parent.
      },
      immediate: true,
    },
  },
});
</script>
