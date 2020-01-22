<template>
  <v-form v-model="formValid">
    <v-row>
      <start-stop-picker
        :value="value.startStop"
        @input="update('startStop', $event)"
      />
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-select
          :value="value.projectId"
          @input="update('projectId', $event)"
          label="Project"
          :items="projectChoices"
          :rules="required"
        />
      </v-col>
      <v-col>
        <v-textarea
          :value="value.description"
          @input="update('description', $event)"
          label="Description"
          rows="1"
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
import { ALL_PROJECTS } from "@/graphql/projects.graphql";
import { AllProjects_allProjects as Project } from "@/graphql/types/AllProjects";
import { VSelectChoices } from "@/common.types";

export default Vue.extend({
  name: "TimeEntryForm",

  components: {
    StartStopPicker
  },

  props: {
    value: {} as () => Entry
  },

  apollo: {
    allProjects: {
      query: ALL_PROJECTS
    }
  },

  data() {
    return {
      allProjects: [] as Project[],

      formValid: false,
      required: [(v: string) => !!v || "Required"]
    };
  },

  computed: {
    projectChoices(): VSelectChoices<number> {
      return this.allProjects.map(project => ({
        text: project.title,
        value: project.id
      }));
    }
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
