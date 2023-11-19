/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { PartialType } from "@nestjs/mapped-types";
import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 200, nullable: false })
  fullname: string;

  @Column("varchar", { length: 200, unique: true, nullable: false })
  email: string;
  
  @Exclude()
  @Column("varchar", { length: 200, nullable: false })
  password: string;

  @Column("date", { nullable: false })
  birthday: Date;

  @Column("decimal", { nullable: false })
  balance: number;

  @Column("date", { nullable: false })
  created_at: Date;

  @Column("date", { nullable: false })
  updated_at: Date;
}


export class UpdateUserEntity extends PartialType(UserEntity) {}