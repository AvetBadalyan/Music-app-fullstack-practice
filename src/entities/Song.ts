import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Artist } from './Artist';
import { Album } from './Album';
import { Genre } from './Genre';

@Entity()
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  title!: string;

  @Column({ type: 'int' })
  duration!: number;

  @Column({ length: 50, nullable: true, name: 'audio_file' })
  audioFile!: string;

  @ManyToOne(() => Album, album => album.songs, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  album!: Album;

  @ManyToOne(() => Artist, artist => artist.songs, {
    onDelete: 'CASCADE',
  })
  artist!: Artist;

  @ManyToMany(() => Genre, genre => genre.songs, {
    cascade: true,
  })
  @JoinTable()
  genres!: Genre[];
}
