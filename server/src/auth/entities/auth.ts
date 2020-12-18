import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Role } from "../../account/entities";

@ObjectType()
export class JWTClaims {
  @Field() id: number;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() email: string;
  @Field(() => [Role]) roles: Role[];
}

@InputType()
export class LoginCredentials {
  @Field() email: string;
  @Field() password: string;
}

@ObjectType()
export class LoginResponse {
  @Field() token: string;
  @Field(() => JWTClaims) claims: JWTClaims;
}

@InputType()
export class ChangePasswordInput {
  @Field(() => Int) accountId: number;
  @Field() currentPassword: string;
  @Field() newPassword: string;
}
