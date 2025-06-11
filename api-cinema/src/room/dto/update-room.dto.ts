import { 
  IsNumber, 
  IsString, 
  IsOptional, 
  MinLength, 
  MaxLength, 
  Min, 
  Max,
  ValidateIf 
} from 'class-validator';

export class UpdateRoomDto {

  @IsOptional()
  @ValidateIf((o) => o.capacidade !== undefined)
  @IsNumber({}, { message: 'A capacidade deve ser um número.' })
  @Min(1, { message: 'A capacidade deve ser maior que 0.' })
  @Max(500, { message: 'A capacidade deve ser menor que 500.' })
  capacidade?: number;

  @IsOptional()
  @ValidateIf((o) => o.tipo !== undefined)
  @IsString({ message: 'O tipo deve ser uma string.' })
  @MaxLength(50, { message: 'O tipo deve ter no máximo 50 caracteres.' })
  tipo?: string;
}
