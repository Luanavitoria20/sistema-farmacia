
import { ApiProperty } from '@nestjs/swagger';

export class CriarMedicamentoDto {
  @ApiProperty({ example: 'Paracetamol' })
  nome: string;

  @ApiProperty({ example: 'Paracetamol' })
  principioAtivo: string;

  @ApiProperty({ example: 50 })
  quantidade: number;

  @ApiProperty({ example: 12.5 })
  preco: number;
}
