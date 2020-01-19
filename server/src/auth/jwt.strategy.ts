import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./constants";
import { JWTClaims } from "./entities";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    });
  }

  // By the time we're called, Passport will have validated the payload,
  // so we can just use it here.
  async validate(payload: JWTClaims) {
    // console.log("VALIDATED", payload);
    return payload;
  }
}
