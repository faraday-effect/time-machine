import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Project,
  ProjectCreateInput,
  ProjectSummary,
  ProjectUpdateInput
} from "./entities";
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
    return this.projectRepo.query(`
            SELECT p.*, count(e) AS "entryCount"
            FROM project AS p
                     LEFT OUTER JOIN entry e ON p.id = e."projectId"
            GROUP BY p.id;
        `);
  }

  readProjectSummaries(): Promise<ProjectSummary> {
    return this.projectRepo.query(`
            SELECT p.id                                                                 AS "projectId",
                   p.title,
                   count(e)                                                             AS "entryCount",
                   extract(EPOCH FROM sum(e.stop::timestamp - e.start::timestamp)) / 60 AS "totalMinutes"
            FROM project p
                     INNER JOIN entry e ON p.id = e."projectId"
            GROUP BY p.id, p.title
            ORDER BY p.title`);
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
