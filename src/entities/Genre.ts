import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Song } from './Song';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50 })
  name!: string;

  @ManyToMany(() => Song, song => song.genres)
  songs!: Song[];
}
