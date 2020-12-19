import { Command } from "@oclif/command";
import { hash } from "bcrypt";

export default class HashPassword extends Command {
  static description = "hash a password";

  static args = [
    {
      name: "password",
      required: true,
      description: "Plaintext password",
    },
  ];

  async run() {
    const { args } = this.parse(HashPassword);
    await hash(args.password, 10).then((result: string) => this.log(result));
  }
}
