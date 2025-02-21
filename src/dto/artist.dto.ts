import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  bio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  profile_picture?: string;
}

export class SearchArtistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
