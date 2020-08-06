import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { User } from './User';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  filePath: string;

  @ManyToOne(type => User, user => user.documents, {
    onUpdate: 'SET NULL',
    onDelete: 'SET NULL',
  })
  owner: User;
}
