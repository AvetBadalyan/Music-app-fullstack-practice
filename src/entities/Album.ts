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

  @Column({ type: 'date', nullable: true, name: 'release_date' })
  releaseDate!: string;

  @Column({ length: 50, nullable: true, name: 'cover_image' })
  coverImage!: string;

  @ManyToOne(() => Artist, artist => artist.albums, {
    onDelete: 'CASCADE',
  })
  artist!: Artist;

  @OneToMany(() => Song, song => song.album, {
    cascade: true,
  })
  songs!: Song[];
}
