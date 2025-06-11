import { 
  IsNumber, 
  IsString, 
  IsNotEmpty, 
  MinLength, 
  MaxLength, 
  Min, 
  Matches 
} from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty({ message: 'O ID da sessão é obrigatório.' })
  @IsNumber({}, { message: 'O ID da sessão deve ser um número.' })
  @Min(1, { message: 'O ID da sessão deve ser maior que 0.' })
  session_id: number;

  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @IsString({ message: 'O CPF deve ser uma string.' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, { 
    message: 'CPF deve estar no formato XXX.XXX.XXX-XX ou apenas números.' 
  })
  cpf: string;

  @IsNotEmpty({ message: 'O assento é obrigatório.' })
  @IsString({ message: 'O assento deve ser uma string.' })
  @MinLength(1, { message: 'O assento deve ter pelo menos 1 caractere.' })
  @MaxLength(10, { message: 'O assento deve ter no máximo 10 caracteres.' })
  assento: string;

  @IsNotEmpty({ message: 'A forma de pagamento é obrigatória.' })
  @IsString({ message: 'A forma de pagamento deve ser uma string.' })
  @MaxLength(50, { message: 'A forma de pagamento deve ter no máximo 50 caracteres.' })
  formaPagamento: string;
}
