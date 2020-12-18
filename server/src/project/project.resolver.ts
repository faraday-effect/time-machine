import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProjectService } from "./project.service";
import {
  Project,
  ProjectCreateInput,
  ProjectSummary,
  ProjectUpdateInput
} from "./entities";
import { Int } from "@nestjs/graphql";

@Resolver("Project")
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Mutation(() => Project)
  createProject(@Args("createInput") createInput: ProjectCreateInput) {
    return this.projectService.createProject(createInput);
  }

  @Query(() => [Project])
  readProjects() {
    return this.projectService.readProjects();
  }

  @Query(() => [ProjectSummary])
  readProjectSummaries() {
    return this.projectService.readProjectSummaries();
  }

  @Mutation(() => Project)
  updateProject(@Args("updateInput") updateInput: ProjectUpdateInput) {
    return this.projectService.updateProject(updateInput);
  }

  @Mutation(() => Int)
  deleteProject(@Args({ name: "id", type: () => Int }) id: number) {
    return this.projectService.deleteProject(id);
  }
}
