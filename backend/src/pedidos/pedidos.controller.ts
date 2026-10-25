import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CambiarEstadoDto, CrearPedidoDto } from './dto/pedido.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.mapper';

@Controller('pedidos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // Los administradores no compran
  @Post()
  @Roles('cliente')
  crear(@CurrentUser() user: AuthUser, @Body() dto: CrearPedidoDto) {
    return this.pedidosService.crear(user, dto);
  }

  @Get('mios')
  @Roles('cliente')
  mios(@CurrentUser() user: AuthUser) {
    return this.pedidosService.listarDeCliente(user.id);
  }

  @Get()
  @Roles('admin')
  todos() {
    return this.pedidosService.listarTodos();
  }

  @Get(':codigo')
  obtener(@Param('codigo') codigo: string, @CurrentUser() user: AuthUser) {
    return this.pedidosService.obtener(codigo, user);
  }

  @Patch(':codigo/estado')
  @Roles('admin')
  cambiarEstado(@Param('codigo') codigo: string, @Body() dto: CambiarEstadoDto) {
    return this.pedidosService.cambiarEstado(codigo, dto.estado);
  }
}
