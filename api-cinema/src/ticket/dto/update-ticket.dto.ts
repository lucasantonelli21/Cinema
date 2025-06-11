import { 
  IsNumber, 
  IsString, 
  IsOptional, 
  MinLength, 
  MaxLength, 
  Min, 
  Matches,
  ValidateIf 
} from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @ValidateIf((o) => o.session_id !== undefined)
  @IsNumber({}, { message: 'O ID da sessão deve ser um número.' })
  @Min(1, { message: 'O ID da sessão deve ser maior que 0.' })
  session_id?: number;

  @IsOptional()
  @ValidateIf((o) => o.cpf !== undefined)
  @IsString({ message: 'O CPF deve ser uma string.' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, { 
    message: 'CPF deve estar no formato XXX.XXX.XXX-XX ou apenas números.' 
  })
  cpf?: string;

  @IsOptional()
  @ValidateIf((o) => o.assento !== undefined)
  @IsString({ message: 'O assento deve ser uma string.' })
  @MinLength(1, { message: 'O assento deve ter pelo menos 1 caractere.' })
  @MaxLength(10, { message: 'O assento deve ter no máximo 10 caracteres.' })
  assento?: string;

  @IsOptional()
  @ValidateIf((o) => o.formaPagamento !== undefined)
  @IsString({ message: 'A forma de pagamento deve ser uma string.' })
  @MaxLength(50, { message: 'A forma de pagamento deve ter no máximo 50 caracteres.' })
  formaPagamento?: string;
}
