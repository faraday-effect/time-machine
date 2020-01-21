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
        <template v-slot:item.actions="{ item }">
          <action-icons
            @update="showUpdateDialog(item)"
            @delete="deleteProject(item.id)"
          />
        </template>
      </v-data-table>
    </v-card>

    <project-dialog
      v-model="createDialog.visible"
      title="Create project"
      :project="{}"
      @ready="createProject"
    />

    <project-dialog
      v-model="updateDialog.visible"
      title="Update project"
      :project="updateDialog.project"
      @ready="updateProject"
    />

    <v-snackbar v-model="snackbar.visible">
      {{ snackbar.content }}
      <v-btn text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {
  ALL_PROJECTS,
  CREATE_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT
} from "@/graphql/projects.graphql";
import ActionIcons from "@/components/ActionIcons.vue";
import ProjectDialog from "@/components/dialogs/ProjectDialog.vue";
import {
  CreateProject,
  CreateProject_newProject as Project,
  CreateProjectVariables
} from "@/graphql/types/CreateProject";
import {
  DeleteProject,
  DeleteProjectVariables
} from "@/graphql/types/DeleteProject";
import {
  UpdateProject,
  UpdateProjectVariables
} from "@/graphql/types/UpdateProject";

export default Vue.extend({
  name: "Projects",

  components: {
    ActionIcons,
    ProjectDialog
  },

  apollo: {
    allProjects: {
      query: ALL_PROJECTS
    }
  },

  data() {
    return {
      allProjects: [] as Project[],

      createDialog: {
        visible: false
      },

      updateDialog: {
        project: {} as Project,
        visible: false
      },

      headers: [
        { text: "Title", value: "title" },
        { text: "Description", value: "description" },
        { text: "Active", value: "active" },
        { text: "Actions", value: "actions" }
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
    },

    showCreateDialog() {
      this.createDialog.visible = true;
    },

    showUpdateDialog(project: Project) {
      this.updateDialog.project = project;
      this.updateDialog.visible = true;
    },

    createProject(project: Project) {
      console.log("PROJECT", project);
      this.$apollo
        .mutate<CreateProject>({
          mutation: CREATE_PROJECT,
          variables: {
            createInput: project
          } as CreateProjectVariables
        })
        .then(result => {
          const newProject = result.data!.newProject;
          this.allProjects.push(newProject);
          this.showSnackbar(`Created project ${newProject.title}`);
        });
    },

    updateProject(project: Project) {
      this.$apollo
        .mutate<UpdateProject>({
          mutation: UPDATE_PROJECT,
          variables: {
            updateInput: project

            // NO WORKIE
            // message: "Variable "$updateInput" got invalid value { id: 4, title: "Zelda", description: "What it is.", active: true, __typename: "Project" }; Field "__typename" is not defined by type ProjectUpdateInput."
          } as UpdateProjectVariables
        })
        .then(result => {
          const updatedProject = result.data!.updatedProject;
          const idx = this.allProjects.findIndex(
            project => project.id === updatedProject.id
          );
          this.$set(this.allProjects, idx, updatedProject);
          this.showSnackbar(`Updated project ${updatedProject.title}`);
        });
    },

    deleteProject(id: number) {
      this.$apollo
        .mutate<DeleteProject>({
          mutation: DELETE_PROJECT,
          variables: { id } as DeleteProjectVariables
        })
        .then(() => {
          const idx = this.allProjects.findIndex(project => project.id === id);
          this.allProjects.splice(idx, 1);
          this.showSnackbar("Project deleted");
        });
    }
  }
});
</script>
