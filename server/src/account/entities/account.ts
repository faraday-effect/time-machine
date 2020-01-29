import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Field, ObjectType, Int, InputType } from "type-graphql";
import { Entry } from "@/entry/entities";
import { Project } from "@/project/entities";
import { hashPassword } from "@/auth/crypto";
import { Role } from "./role";

@Entity()
@ObjectType()
export class Account {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field() @Column({ unique: true }) email: string;
  @Field() @Column() firstName: string;
  @Field() @Column() lastName: string;

  @Column() password: string; // Not available via GraphQL

  @BeforeInsert()
  private async encryptOnCreate() {
    // When creating a new account, encrypt its password before storing to the database.
    this.password = await hashPassword(this.password);
  }

  @BeforeUpdate()
  private async encryptOnUpdate() {
    // Whe updating an existing account, encrypt its password before storing to the database.
    this.password = await hashPassword(this.password);
  }

  @OneToMany(
    () => Entry,
    entry => entry.account
  )
  entries: Entry[];

  @ManyToMany(
    () => Project,
    project => project.accounts
  )
  projects: Project[];

  @ManyToMany(
    () => Role,
    role => role.accounts
  )
  roles: Role[];
}

@InputType()
export class AccountCreateInput {
  @Field({ description: "Email address" }) email: string;
  @Field({ description: "Password" }) password: string;
  @Field({ description: "First name" }) firstName: string;
  @Field({ description: "Last name" }) lastName: string;
}

@InputType()
export class AccountUpdateInput {
  @Field(() => Int) id: number;
  @Field({ description: "Email address", nullable: true }) email?: string;
  @Field({ description: "Password", nullable: true }) password?: string;
  @Field({ description: "First name", nullable: true }) firstName?: string;
  @Field({ description: "Last name", nullable: true }) lastName?: string;
}

@ObjectType()
export class AccountSummary {
  @Field(() => Int, { description: "Account ID" }) accountId: number;
  @Field({ description: "First name" }) firstName: string;
  @Field({ description: "Last name" }) lastName: string;
  @Field(() => Int, { description: "Number of time entries" })
  entryCount: number;
  @Field(() => Int, { description: "Total duration (minutes)" })
  totalMinutes: number;
}
