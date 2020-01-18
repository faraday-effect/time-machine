import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project, ProjectCreateInput, ProjectUpdateInput } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>
  ) {}

  createProject(createInput: ProjectCreateInput) {
    return this.projectRepo.save(this.projectRepo.create(createInput));
  }

  readProjects() {
    return this.projectRepo.find();
  }

  updateProject(updateInput: ProjectUpdateInput) {
    return this.projectRepo
      .preload(updateInput)
      .then(result => this.projectRepo.save(result));
  }

  deleteProject(id: number) {
    return this.projectRepo.delete(id).then(result => result.affected);
  }
}
