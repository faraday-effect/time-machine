import { Field, InputType, ObjectType } from "type-graphql";
import { JWTClaims } from "../../account/entities";

@InputType()
export class LoginCredentials {
  @Field() email: string;
  @Field() password: string;
}

@ObjectType()
export class LoginResponse {
  @Field() accessToken: string;
  @Field(type => JWTClaims) claims: JWTClaims;
}
