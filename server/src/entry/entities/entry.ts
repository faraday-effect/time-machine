import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Project } from "../../project/entities";
import { Account } from "../../account/entities";

@Entity()
@ObjectType()
export class Entry {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field() @CreateDateColumn() created: Date;
  @Field() @UpdateDateColumn() updated: Date;
  @Field() @Column() start: string;
  @Field() @Column() stop: string;
  @Field() @Column("text") description: string;

  @Field(() => Account)
  @ManyToOne(() => Account, (account) => account.entries, { nullable: false })
  account: Account;
  @Column("integer") accountId: number;

  @Field(() => Project)
  @ManyToOne(() => Project, (project) => project.entries, { nullable: false })
  project: Project;
  @Column("integer") projectId: number;
}

@InputType()
export class EntryCreateInput {
  @Field(() => Int) accountId: number;
  @Field(() => Int) projectId: number;
  @Field() start: string;
  @Field() stop: string;
  @Field() description: string;
}

@InputType()
export class EntryUpdateInput {
  @Field(() => Int) id: number;
  @Field({ nullable: true }) projectId: number;
  @Field({ nullable: true }) start: string;
  @Field({ nullable: true }) stop: string;
  @Field({ nullable: true }) description: string;
}
