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
  releaseDate?: string;

  @IsUUID()
  @IsNotEmpty()
  artistId: string;
}
