
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicamento } from './medicamento.entity';

@Injectable()
export class MedicamentosService {
  constructor(
    @InjectRepository(Medicamento)
    private readonly medicamentoRepository: Repository<Medicamento>,
  ) {}

  listarTodos(): Promise<Medicamento[]> {
    return this.medicamentoRepository.find();
  }

  async buscarPorId(id: number): Promise<Medicamento> {
    const medicamento = await this.medicamentoRepository.findOneBy({ id });

    if (!medicamento) {
      throw new NotFoundException('Medicamento não encontrado');
    }

    return medicamento;
  }

  criar(dados: Omit<Medicamento, 'id'>): Promise<Medicamento> {
    const medicamento = this.medicamentoRepository.create(dados);
    return this.medicamentoRepository.save(medicamento);
  }

  async atualizar(
    id: number,
    dados: Partial<Omit<Medicamento, 'id'>>,
  ): Promise<Medicamento> {
    const medicamento = await this.buscarPorId(id);

    Object.assign(medicamento, dados);

    return this.medicamentoRepository.save(medicamento);
  }

  async remover(id: number): Promise<{ mensagem: string }> {
    const medicamento = await this.buscarPorId(id);

    await this.medicamentoRepository.remove(medicamento);

    return { mensagem: 'Medicamento removido com sucesso' };
  }
}
