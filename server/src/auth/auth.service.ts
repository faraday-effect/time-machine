import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { validatePassword } from "./crypto";
import { LoginCredentials } from "./entities";
import { AccountService } from "@/account/account.service";
import {JWTClaims} from "@/account/entities";

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginCredentials: LoginCredentials) {
    const account = await this.accountService.findAccountByEmail(
      loginCredentials.email
    );

    if (account) {
      const validPassword = await validatePassword(
        loginCredentials.password,
        account.password
      );

      if (validPassword) {
        const accountPayload: JWTClaims = {
          id: account.id,
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          roles: account.roles
        };
        const token = this.jwtService.sign(accountPayload);

        return {
          account: accountPayload,
          accessToken: token
        };
      }
    }

    throw new UnauthorizedException();
  }
}
