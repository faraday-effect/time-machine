import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Entry } from "@/entry/entities";
import { Account } from "@/account/entities";

@Entity()
@ObjectType()
export class Project {
  @Field(() => Int) @PrimaryGeneratedColumn() id: number;
  @Field({ description: "Project title" }) @Column() title: string;
  @Field({ description: "Description of this project" })
  @Column()
  description: string;
  @Field({ description: "Is this project active?" }) @Column() active: boolean;

  @Field(() => [Entry])
  @OneToMany(
    () => Entry,
    entry => entry.project
  )
  entries: Entry[];

  @Field(() => [Account])
  @ManyToMany(
    () => Account,
    account => account.projects
  )
  accounts: Account[];
}

@InputType()
export class ProjectCreateInput {
  @Field({ description: "Project title" }) title: string;
  @Field({ description: "Description of this project" }) description: string;
  @Field({ description: "Is this project active?" }) active: boolean;
}

@InputType()
export class ProjectUpdateInput {
  @Field(() => Int) id: number;
  @Field({ description: "Project title", nullable: true }) title?: string;
  @Field({ description: "Description of this project", nullable: true })
  description?: string;
  @Field({ description: "Is this project active?", nullable: true })
  active?: boolean;
}
