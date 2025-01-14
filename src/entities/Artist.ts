import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Album } from './Album';
import { Song } from './Song';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profile_picture: string;

  @OneToMany(() => Album, album => album.artist)
  albums: Album[];

  @OneToMany(() => Song, song => song.artist)
  songs: Song[];
}
