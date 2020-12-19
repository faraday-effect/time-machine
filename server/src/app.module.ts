import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountModule } from "./account/account.module";
import { Account, Role } from "./account/entities";
import { EntryModule } from "./entry/entry.module";
import { Entry } from "./entry/entities";
import { GraphQLModule } from "@nestjs/graphql";
import { Project } from "./project/entities";
import { ProjectModule } from "./project/project.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.graphql",
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      synchronize: true,
      entities: [Account, Entry, Project, Role],
      logging: "all",
    }),
    AccountModule,
    AuthModule,
    EntryModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
