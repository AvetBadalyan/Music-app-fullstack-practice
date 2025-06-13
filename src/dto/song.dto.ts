import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SearchSongDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
}
