import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateGenreDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
