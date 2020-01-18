import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./jwt.strategy";
import { AuthResolver } from "./auth.resolvers";
import { AccountModule } from "../account/account.module";

@Module({
  imports: [
    AccountModule,
    PassportModule,
    JwtModule.register({ secret: jwtConstants.secret })
  ],
  providers: [AuthService, JwtStrategy, AuthResolver],
  exports: [AuthService]
})
export class AuthModule {}
