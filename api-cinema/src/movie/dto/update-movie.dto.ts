import { 
  IsNumber, 
  IsString, 
  IsDateString, 
  IsOptional, 
  MinLength, 
  MaxLength, 
  Min, 
  Max, 
  IsUrl,
  ValidateIf 
} from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @ValidateIf((o) => o.titulo !== undefined)
  @IsString({ message: 'O título deve ser uma string.' })
  @MinLength(1, { message: 'O título deve ter pelo menos 1 caractere.' })
  @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres.' })
  titulo?: string;

  @IsOptional()
  @ValidateIf((o) => o.sinopse !== undefined)
  @IsString({ message: 'A sinopse deve ser uma string.' })
  @MinLength(10, { message: 'A sinopse deve ter pelo menos 10 caracteres.' })
  @MaxLength(1000, { message: 'A sinopse deve ter no máximo 1000 caracteres.' })
  sinopse?: string;

  @IsOptional()
  @ValidateIf((o) => o.genero !== undefined)
  @IsString({ message: 'O gênero deve ser uma string.' })
  @MaxLength(100, { message: 'O gênero deve ter no máximo 100 caracteres.' })
  genero?: string;

  @IsOptional()
  @ValidateIf((o) => o.classificacao !== undefined)
  @IsNumber({}, { message: 'A classificação deve ser um número.' })
  @Min(0, { message: 'A classificação deve ser maior ou igual a 0.' })
  @Max(18, { message: 'A classificação deve ser menor ou igual a 18.' })
  classificacao?: number;

  @IsOptional()
  @ValidateIf((o) => o.duracao !== undefined)
  @IsNumber({}, { message: 'A duração deve ser um número.' })
  @Min(1, { message: 'A duração deve ser maior que 0 minutos.' })
  @Max(600, { message: 'A duração deve ser menor que 600 minutos.' })
  duracao?: number;

  @IsOptional()
  @ValidateIf((o) => o.dataEstreia !== undefined)
  @IsDateString({}, { message: 'A data de estreia deve ser uma data válida.' })
  dataEstreia?: Date;

  @IsOptional()
  @ValidateIf((o) => o.imagemUrl !== undefined)
  @IsString({ message: 'A URL da imagem deve ser uma string.' })
  @IsUrl({}, { message: 'Deve ser uma URL válida.' })
  imagemUrl?: string;
}
