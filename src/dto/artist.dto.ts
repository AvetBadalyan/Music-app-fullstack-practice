import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SearchArtistDto {
  @IsString()
  @IsNotEmpty({ message: 'name parameter is required' })
  @MaxLength(100, { message: 'name parameter must not exceed 100 characters' })
  name: string;
}
