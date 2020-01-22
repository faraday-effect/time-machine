import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Account } from "./account";
@Entity()
@ObjectType()
export class Role {
  @Field(() => Int) @PrimaryGeneratedColumn() id: number;
  @Field({ description: "Role name" }) @Column({ unique: true }) name: string;
  @Field({ description: "Description of this role" })
  @Column()
  description: string;

  @Field(() => [Account])
  @ManyToMany(
    () => Account,
    account => account.roles
  )
  @JoinTable()
  accounts: Account[];
}

@InputType()
export class RoleCreateInput {
  @Field({ description: "Role name" }) name: string;
  @Field({ description: "Description of this role" }) description: string;
}

@InputType()
export class RoleUpdateInput {
  @Field(() => Int) id: number;
  @Field({ description: "Role name", nullable: true }) name?: string;
  @Field({ description: "Description of this role", nullable: true })
  description?: string;
}
