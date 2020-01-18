import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectResolver } from "./project.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Project } from "./entities";

@Module({
    imports: [TypeOrmModule.forFeature([Project])],
    providers: [ProjectService, ProjectResolver]
})
export class ProjectModule {}
