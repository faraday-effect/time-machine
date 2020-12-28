import { Command } from "@oclif/command";
import { compareSync, getRounds } from "bcrypt";

export default class PasswordCompare extends Command {
  static description = "compare a password to a hash";

  static args = [
    {
      name: "password",
      required: true,
      description: "Plaintext password",
    },
    {
      name: "hash",
      required: true,
      description: "Hashed password",
    },
  ];

  async run() {
    const { args } = this.parse(PasswordCompare);
    const result = compareSync(args.password, args.hash);
    const rounds = getRounds(args.hash);
    this.log("%s (%d rounds)", result ? "Match" : "No match", rounds);
  }
}
