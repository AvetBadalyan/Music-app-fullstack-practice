import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateArtistDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  @MaxLength(100, { message: 'name must not exceed 100 characters' })
  name: string;

  @IsString({ message: 'bio must be a string' })
  @IsOptional()
  @MaxLength(1000, { message: 'bio must not exceed 1000 characters' })
  bio?: string;

  @IsString({ message: 'profile_picture must be a string' })
  @IsOptional()
  @MaxLength(50, { message: 'profile_picture must not exceed 50 characters' })
  profile_picture?: string;
}

export class SearchArtistDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name parameter is required' })
  @MaxLength(100, { message: 'name parameter must not exceed 100 characters' })
  name: string;
}
