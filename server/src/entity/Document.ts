import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { User } from './User';
import { Bookmark } from './Bookmark';

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

  @OneToMany(type => Bookmark, bookmark => bookmark.document, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  bookmarks: Bookmark[];
}
