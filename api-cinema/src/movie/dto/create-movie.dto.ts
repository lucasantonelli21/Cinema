import { 
  IsNumber, 
  IsString, 
  IsDateString, 
  IsOptional, 
  IsNotEmpty, 
  MinLength, 
  MaxLength, 
  Min, 
  Max, 
  IsUrl 
} from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @IsString({ message: 'O título deve ser uma string.' })
  @MinLength(1, { message: 'O título deve ter pelo menos 1 caractere.' })
  @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres.' })
  titulo: string;

  @IsNotEmpty({ message: 'A sinopse é obrigatória.' })
  @IsString({ message: 'A sinopse deve ser uma string.' })
  @MinLength(10, { message: 'A sinopse deve ter pelo menos 10 caracteres.' })
  @MaxLength(1000, { message: 'A sinopse deve ter no máximo 1000 caracteres.' })
  sinopse: string;

  @IsNotEmpty({ message: 'O gênero é obrigatório.' })
  @IsString({ message: 'O gênero deve ser uma string.' })
  @MaxLength(100, { message: 'O gênero deve ter no máximo 100 caracteres.' })
  genero: string;

  @IsNotEmpty({ message: 'A classificação é obrigatória.' })
  @IsNumber({}, { message: 'A classificação deve ser um número.' })
  @Min(0, { message: 'A classificação deve ser maior ou igual a 0.' })
  @Max(18, { message: 'A classificação deve ser menor ou igual a 18.' })
  classificacao: number;

  @IsNotEmpty({ message: 'A duração é obrigatória.' })
  @IsNumber({}, { message: 'A duração deve ser um número.' })
  @Min(1, { message: 'A duração deve ser maior que 0 minutos.' })
  @Max(600, { message: 'A duração deve ser menor que 600 minutos.' })
  duracao: number;

  @IsOptional()
  @IsDateString({}, { message: 'A data de estreia deve ser uma data válida.' })
  dataEstreia?: Date;

  @IsNotEmpty({ message: 'A URL da imagem é obrigatória.' })
  @IsString({ message: 'A URL da imagem deve ser uma string.' })
  @IsUrl({}, { message: 'Deve ser uma URL válida.' })
  imagemUrl: string;
}
