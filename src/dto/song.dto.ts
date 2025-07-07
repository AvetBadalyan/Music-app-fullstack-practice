import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUUID,
  IsArray,
} from 'class-validator';

export class SearchSongDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
}

export class CreateSongDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsUUID()
  @IsNotEmpty()
  artistId: string;

  @IsUUID()
  @IsOptional()
  albumId?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  genreIds?: string[];
}
