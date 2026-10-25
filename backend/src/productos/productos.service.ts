import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarProductoDto, CrearProductoDto, FiltroProductosDto } from './dto/producto.dto';
import { ProductoPublico, toProductoPublico } from './producto.mapper';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(filtro: FiltroProductosDto): Promise<ProductoPublico[]> {
    const productos = await this.prisma.producto.findMany({
      where: { activo: true, ...(filtro.categoria ? { categoria: filtro.categoria } : {}) },
      orderBy: { id: 'asc' },
    });
    return productos.map(toProductoPublico);
  }

  async obtener(id: number): Promise<ProductoPublico> {
    const producto = await this.prisma.producto.findFirst({ where: { id, activo: true } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return toProductoPublico(producto);
  }

  async crear(dto: CrearProductoDto): Promise<ProductoPublico> {
    return toProductoPublico(await this.prisma.producto.create({ data: dto }));
  }

  async actualizar(id: number, dto: ActualizarProductoDto): Promise<ProductoPublico> {
    return toProductoPublico(await this.prisma.producto.update({ where: { id }, data: dto }));
  }

  /** Borrado lógico: el producto sigue existiendo para los pedidos históricos. */
  async desactivar(id: number): Promise<void> {
    await this.prisma.producto.update({ where: { id }, data: { activo: false } });
  }
}
