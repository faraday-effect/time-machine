import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Field, ObjectType, Int, InputType } from "type-graphql";
import { Entry } from "../../entry/entities";
import { Project } from "../../project/entities";

@Entity()
@ObjectType()
export class Account {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field() @Column() email: string;
  @Field() @Column() password: string;
  @Field() @Column() firstName: string;
  @Field() @Column() lastName: string;

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
}

@InputType()
export class AccountCreateInput {
  @Field() email: string;
  @Field() password: string;
  @Field() firstName: string;
  @Field() lastName: string;
}
