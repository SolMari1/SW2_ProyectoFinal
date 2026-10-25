import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../auth/auth.mapper';
import { CrearPedidoDto } from './dto/pedido.dto';
import { construirLineasPedido } from './lineas-pedido';
import { PEDIDO_INCLUDE, PedidoPublico, estadoDesdeLabel, parsearCodigoPedido, toPedidoPublico } from './pedido.mapper';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(cliente: AuthUser, dto: CrearPedidoDto): Promise<PedidoPublico> {
    const ids = [...new Set(dto.items.map((item) => item.productoId))];
    const productos = await this.prisma.producto.findMany({
      where: { id: { in: ids } },
      select: { id: true, nombre: true, precio: true, tallas: true, activo: true },
    });
    const { lineas, total } = construirLineasPedido(dto.items, productos);

    const pedido = await this.prisma.pedido.create({
      data: {
        clienteId: cliente.id,
        total,
        estado: 'EN_PROCESO',
        items: { create: lineas },
      },
      include: PEDIDO_INCLUDE,
    });
    return toPedidoPublico(pedido);
  }

  async listarDeCliente(clienteId: number): Promise<PedidoPublico[]> {
    const pedidos = await this.prisma.pedido.findMany({
      where: { clienteId },
      include: PEDIDO_INCLUDE,
      orderBy: [{ fecha: 'desc' }, { id: 'desc' }],
    });
    return pedidos.map(toPedidoPublico);
  }

  async listarTodos(): Promise<PedidoPublico[]> {
    const pedidos = await this.prisma.pedido.findMany({
      include: PEDIDO_INCLUDE,
      orderBy: [{ fecha: 'desc' }, { id: 'desc' }],
    });
    return pedidos.map(toPedidoPublico);
  }

  /** Un cliente solo puede ver sus pedidos; el admin ve cualquiera. */
  async obtener(codigo: string, usuario: AuthUser): Promise<PedidoPublico> {
    const id = this.idDesdeCodigo(codigo);
    const pedido = await this.prisma.pedido.findUnique({ where: { id }, include: PEDIDO_INCLUDE });
    if (!pedido || (usuario.rol !== 'admin' && pedido.clienteId !== usuario.id)) {
      throw new NotFoundException('Pedido no encontrado');
    }
    return toPedidoPublico(pedido);
  }

  async cambiarEstado(codigo: string, label: string): Promise<PedidoPublico> {
    const estado = estadoDesdeLabel(label);
    if (!estado) throw new BadRequestException('Estado inválido');
    const pedido = await this.prisma.pedido.update({
      where: { id: this.idDesdeCodigo(codigo) },
      data: { estado },
      include: PEDIDO_INCLUDE,
    });
    return toPedidoPublico(pedido);
  }

  private idDesdeCodigo(codigo: string): number {
    const id = parsearCodigoPedido(codigo);
    if (id === null) throw new NotFoundException('Pedido no encontrado');
    return id;
  }
}
