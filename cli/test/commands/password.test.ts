import { expect, test } from "@oclif/test";

describe("hash password", () => {
  test
    .stdout()
    .command(["password:hash", "super-secret"])
    .it("hashes a password", (ctx) => {
      // 60 character has plus newline.
      expect(ctx.stdout).to.have.lengthOf(61);
    });
});
