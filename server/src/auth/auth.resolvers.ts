import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "@/auth/auth.service";
import {
  ChangePasswordInput,
  LoginCredentials,
  LoginResponse
} from "./entities";
import { validatePassword } from "@/auth/crypto";
import { AccountService } from "@/account/account.service";

// This should be pretty much the only unguarded resolver; it's the
// one where users log in.
@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly accountService: AccountService
  ) {}

  @Mutation(() => LoginResponse)
  login(@Args("loginCredentials") loginCredentials: LoginCredentials) {
    return this.authService.login(loginCredentials);
  }

  @Mutation(() => String)
  async changePassword(
    @Args("passwordInput") passwordInput: ChangePasswordInput
  ) {
    const user = await this.accountService.readAccount(passwordInput.accountId);

    const validPassword = await validatePassword(
      passwordInput.currentPassword,
      user.password
    );

    if (validPassword) {
      return this.accountService
        .updateAccount({
          id: passwordInput.accountId,
          password: passwordInput.newPassword
        })
        .then(() => "Password changed")
        .catch(err => `Something went wrong: ${err}`);
    } else {
      return "Invalid credentials; please try again";
    }
  }
}
