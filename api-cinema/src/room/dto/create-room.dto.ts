import { 
  IsNumber, 
  IsString, 
  IsNotEmpty, 
  MinLength, 
  MaxLength, 
  Min, 
  Max 
} from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty({ message: 'A capacidade é obrigatória.' })
  @IsNumber({}, { message: 'A capacidade deve ser um número.' })
  @Min(1, { message: 'A capacidade deve ser maior que 0.' })
  @Max(500, { message: 'A capacidade deve ser menor que 500.' })
  capacidade: number;

  @IsNotEmpty({ message: 'O tipo da sala é obrigatório.' })
  @IsString({ message: 'O tipo deve ser uma string.' })
  @MaxLength(50, { message: 'O tipo deve ter no máximo 50 caracteres.' })
  tipo: string;
}
