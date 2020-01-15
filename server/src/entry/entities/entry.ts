import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";

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
}

@InputType()
export class EntryCreateInput {
  @Field() start: string;
  @Field() stop: string;
  @Field() description: string;
}

@InputType()
export class EntryUpdateInput {
  @Field(() => Int) id: number;
  @Field({ nullable: true }) start: string;
  @Field({ nullable: true }) stop: string;
  @Field({ nullable: true }) description: string;
}
