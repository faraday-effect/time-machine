import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProjectService } from "./project.service";
import { Project, ProjectCreateInput, ProjectUpdateInput } from "./entities";
import { Int } from "type-graphql";

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

  @Mutation(() => Project)
  updateProject(@Args("updateInput") updateInput: ProjectUpdateInput) {
    return this.projectService.updateProject(updateInput);
  }

  @Mutation(() => Int)
  deleteProject(@Args({ name: "id", type: () => Int }) id: number) {
    return this.projectService.deleteProject(id);
  }
}
