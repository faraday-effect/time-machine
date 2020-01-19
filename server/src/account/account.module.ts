import { Module } from "@nestjs/common";
import { AccountResolver } from "./account.resolver";
import { AccountService } from "./account.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account, Role } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([Account, Role])],
  providers: [AccountResolver, AccountService],
  exports: [AccountService]
})
export class AccountModule {}
