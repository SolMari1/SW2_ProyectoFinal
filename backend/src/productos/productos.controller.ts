import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ActualizarProductoDto, CrearProductoDto, FiltroProductosDto } from './dto/producto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // El catálogo es público: se puede navegar sin iniciar sesión
  @Get()
  listar(@Query() filtro: FiltroProductosDto) {
    return this.productosService.listar(filtro);
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.obtener(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  crear(@Body() dto: CrearProductoDto) {
    return this.productosService.crear(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarProductoDto) {
    return this.productosService.actualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.desactivar(id);
  }
}
