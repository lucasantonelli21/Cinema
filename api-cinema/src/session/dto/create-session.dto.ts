import { 
  IsNumber, 
  IsString, 
  IsDateString, 
  IsNotEmpty, 
  MinLength, 
  MaxLength, 
  Min, 
  IsOptional 
} from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty({ message: 'O ID do filme é obrigatório.' })
  @IsNumber({}, { message: 'O ID do filme deve ser um número.' })
  @Min(1, { message: 'O ID do filme deve ser maior que 0.' })
  movie_id: number;

  @IsNotEmpty({ message: 'O ID da sala é obrigatório.' })
  @IsNumber({}, { message: 'O ID da sala deve ser um número.' })
  @Min(1, { message: 'O ID da sala deve ser maior que 0.' })
  room_id: number;

  @IsOptional()
  @IsDateString({}, { message: 'A data e hora deve ser uma data válida.' })
  dataHora?: Date;

  @IsNotEmpty({ message: 'O idioma é obrigatório.' })
  @IsString({ message: 'O idioma deve ser uma string.' })
  @MinLength(2, { message: 'O idioma deve ter pelo menos 2 caracteres.' })
  @MaxLength(50, { message: 'O idioma deve ter no máximo 50 caracteres.' })
  idioma: string;

  @IsOptional()
  @IsNumber({}, { message: 'O preço deve ser um número.' })
  @Min(0, { message: 'O preço deve ser maior ou igual a 0.' })
  preco?: number;

  @IsNotEmpty({ message: 'O formato é obrigatório.' })
  @IsString({ message: 'O formato deve ser uma string.' })
  @MaxLength(50, { message: 'O formato deve ter no máximo 50 caracteres.' })
  formato: string;
}
