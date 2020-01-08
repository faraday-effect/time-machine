import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountModule } from "./account/account.module";
import { Account } from "./account/entities";
import { EntryModule } from "./entry/entry.module";
import { Entry } from "./entry/entities/entry";
import { GraphQLModule } from "@nestjs/graphql";

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.graphql"
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      username: "tom",
      database: "time-machine",
      synchronize: true,
      entities: [Account, Entry]
    }),
    AccountModule,
    EntryModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
