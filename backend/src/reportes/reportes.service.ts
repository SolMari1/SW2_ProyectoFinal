import { Injectable } from '@nestjs/common';
import { PedidosService } from '../pedidos/pedidos.service';
import { consolidadoPorProducto, filasClientesCompras, paginar, resumenGeneral } from './reportes.calculos';

@Injectable()
export class ReportesService {
  constructor(private readonly pedidosService: PedidosService) {}

  async clientesCompras(pagina: number, porPagina: number) {
    return paginar(filasClientesCompras(await this.pedidosService.listarTodos()), pagina, porPagina);
  }

  async productos() {
    return consolidadoPorProducto(await this.pedidosService.listarTodos());
  }

  async resumen() {
    return resumenGeneral(await this.pedidosService.listarTodos());
  }
}
