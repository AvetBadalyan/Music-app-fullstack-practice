import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsDateString()
  @IsOptional()
  release_date?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  cover_image?: string;

  @IsUUID()
  @IsNotEmpty()
  artistId: string;
}
