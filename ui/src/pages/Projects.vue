<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-row class="align-baseline">
          <v-col>
            <h1 class="title">Projects</h1>
          </v-col>
          <v-col>
            <v-btn color="primary" @click="showCreateDialog">
              Add Entry
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="allProjects"
        :disable-sort="true"
      >
      </v-data-table>
    </v-card>

    <v-snackbar v-model="snackbar.visible">
      {{ snackbar.content }}
      <v-btn text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { ALL_PROJECTS } from "@/graphql/projects.graphql";

export default Vue.extend({
  name: "Projects",

  apollo: {
    allProjects: {
      query: ALL_PROJECTS
    }
  },

  data() {
    return {
      allProjects: [],

      headers: [
        { text: "Title", value: "title" },
        { text: "Description", value: "description" },
        { text: "Active", value: "active" },
        { text: "Actions" }
      ],

      snackbar: {
        visible: false,
        content: ""
      }
    };
  },

  methods: {
    showSnackbar(content: string) {
      this.snackbar.content = content;
      this.snackbar.visible = true;
    }
  }
});
</script>
