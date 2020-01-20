import { Module } from "@nestjs/common";
import { EntryService } from "./entry.service";
import { EntryResolver } from "./entry.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Entry } from "./entities";
import { Account } from "@/account/entities";

@Module({
  imports: [TypeOrmModule.forFeature([Entry, Account])],
  providers: [EntryService, EntryResolver]
})
export class EntryModule {}
