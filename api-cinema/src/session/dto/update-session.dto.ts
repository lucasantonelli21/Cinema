import { 
  IsNumber, 
  IsString, 
  IsDateString, 
  IsOptional, 
  MinLength, 
  MaxLength, 
  Min,
  ValidateIf 
} from 'class-validator';

export class UpdateSessionDto {
  @IsOptional()
  @ValidateIf((o) => o.movie_id !== undefined)
  @IsNumber({}, { message: 'O ID do filme deve ser um número.' })
  @Min(1, { message: 'O ID do filme deve ser maior que 0.' })
  movie_id?: number;

  @IsOptional()
  @ValidateIf((o) => o.room_id !== undefined)
  @IsNumber({}, { message: 'O ID da sala deve ser um número.' })
  @Min(1, { message: 'O ID da sala deve ser maior que 0.' })
  room_id?: number;

  @IsOptional()
  @ValidateIf((o) => o.dataHora !== undefined)
  @IsDateString({}, { message: 'A data e hora deve ser uma data válida.' })
  dataHora?: Date;

  @IsOptional()
  @ValidateIf((o) => o.idioma !== undefined)
  @IsString({ message: 'O idioma deve ser uma string.' })
  @MinLength(2, { message: 'O idioma deve ter pelo menos 2 caracteres.' })
  @MaxLength(50, { message: 'O idioma deve ter no máximo 50 caracteres.' })
  idioma?: string;

  @IsOptional()
  @ValidateIf((o) => o.preco !== undefined)
  @IsNumber({}, { message: 'O preço deve ser um número.' })
  @Min(0, { message: 'O preço deve ser maior ou igual a 0.' })
  preco?: number;

  @IsOptional()
  @ValidateIf((o) => o.formato !== undefined)
  @IsString({ message: 'O formato deve ser uma string.' })
  @MaxLength(50, { message: 'O formato deve ter no máximo 50 caracteres.' })
  formato?: string;
}
