import { Command } from "@oclif/command";
import { hashSync } from "bcrypt";

export default class PasswordHash extends Command {
  static description = "hash a password";

  static args = [
    {
      name: "password",
      required: true,
      description: "Plaintext password",
    },
  ];

  async run() {
    const { args } = this.parse(PasswordHash);
    this.log(hashSync(args.password, 10));
  }
}
