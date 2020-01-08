import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class Entry {
  @PrimaryGeneratedColumn() id: number;
  @CreateDateColumn() created: Date;
  @UpdateDateColumn() updated: Date;
  @Column() start: string;
  @Column() stop: string;
  @Column("text") description: string;
}
