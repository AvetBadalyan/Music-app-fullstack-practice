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

  @Column({ nullable: true })
  audio_file!: string;

  @ManyToOne(() => Album, album => album.songs, { nullable: true })
  album!: Album;

  @ManyToOne(() => Artist, artist => artist.songs)
  artist!: Artist;

  @ManyToMany(() => Genre, genre => genre.songs)
  @JoinTable()
  genres!: Genre[];
}
