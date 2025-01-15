import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Artist } from './Artist';
import { Song } from './Song';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  title!: string;

  @Column({ type: 'date', nullable: true })
  release_date!: string;

  @Column({ nullable: true })
  cover_image!: string;

  @ManyToOne(() => Artist, artist => artist.albums)
  artist!: Artist;

  @OneToMany(() => Song, song => song.album)
  songs!: Song[];
}
