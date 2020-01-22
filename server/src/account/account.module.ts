import { Module } from "@nestjs/common";
import { AccountResolver, RoleResolver } from "./account.resolver";
import { AccountService, RoleService } from "./account.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account, Role } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([Account, Role])],
  providers: [AccountResolver, AccountService, RoleService, RoleResolver],
  exports: [AccountService]
})
export class AccountModule {}
