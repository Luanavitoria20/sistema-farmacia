
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { MedicamentosService } from './medicamentos.service';
import { CriarMedicamentoDto } from './dto/criar-medicamento.dto';

@ApiTags('Medicamentos')
@Controller('medicamentos')
export class MedicamentosController {
  constructor(
    private readonly medicamentosService: MedicamentosService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar medicamento' })
  criar(@Body() dados: CriarMedicamentoDto) {
    return this.medicamentosService.criar(dados);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os medicamentos' })
  listarTodos() {
    return this.medicamentosService.listarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar medicamento por ID' })
  buscarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.medicamentosService.buscarPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar medicamento' })
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    dados: {
      nome?: string;
      principioAtivo?: string;
      quantidade?: number;
      preco?: number;
    },
  ) {
    return this.medicamentosService.atualizar(id, dados);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir medicamento' })
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.medicamentosService.remover(id);
  }
}
