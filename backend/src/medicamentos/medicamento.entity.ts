
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('medicamentos')
export class Medicamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nome: string;

  @Column({ name: 'principio_ativo', length: 150 })
  principioAtivo: string;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;
}
