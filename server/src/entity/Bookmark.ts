import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Document } from './Document';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pageNumber: number;

  @Column()
  text: string;

  @ManyToOne(type => Document, document => document.bookmarks)
  document: Document;
}
