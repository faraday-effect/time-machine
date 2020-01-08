import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType, Int, InputType } from "type-graphql";

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
}

@InputType()
export class AccountCreateInput {
  @Field() email: string;
  @Field() password: string;
  @Field() firstName: string;
  @Field() lastName: string;
}
