import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Field, ObjectType, Int, InputType } from "type-graphql";
import { Entry } from "../../entry/entities";
import { Project } from "../../project/entities";
import { hashPassword } from "../../auth/crypto";
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
    type => Entry,
    entry => entry.account
  )
  entries: Entry[];

  @ManyToMany(
    type => Project,
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
  @Field() email: string;
  @Field() password: string;
  @Field() firstName: string;
  @Field() lastName: string;
}

@InputType()
export class ChangePasswordInput {
  @Field(type => Int) accountId: number;
  @Field() currentPassword: string;
  @Field() newPassword: string;
}

@ObjectType()
export class JWTClaims {
  @Field() id: number;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() email: string;
  @Field(type => [Role]) roles: Role[];
}
