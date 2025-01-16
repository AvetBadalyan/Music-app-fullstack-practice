import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Album } from './Album';
import { Song } from './Song';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 1000, nullable: true })
  bio!: string;

  @Column({ length: 50, nullable: true })
  profile_picture!: string;

  @OneToMany(() => Album, album => album.artist)
  albums!: Album[];

  @OneToMany(() => Song, song => song.artist)
  songs!: Song[];
}
