import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Document } from './Document';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(type => Document, document => document.owner)
  @JoinColumn()
  documents: Document[];
}
