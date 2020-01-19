import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { validatePassword } from "./crypto";
import { JWTClaims, LoginCredentials } from "./entities";
import { AccountService } from "@/account/account.service";

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
        const jwtClaims: JWTClaims = {
          id: account.id,
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          roles: account.roles
        };
        const token = this.jwtService.sign(jwtClaims);

        return {
          token,
          claims: jwtClaims
        };
      }
    }

    throw new UnauthorizedException();
  }
}
