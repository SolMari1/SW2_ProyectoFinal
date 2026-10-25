import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

export class PaginacionDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  porPagina: number = 5;
}

@Controller('reportes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  /** Informe 1: tabular de clientes y compras (paginado, 5 por página por defecto). */
  @Get('clientes-compras')
  clientesCompras(@Query() query: PaginacionDto) {
    return this.reportesService.clientesCompras(query.pagina, query.porPagina);
  }

  /** Informe 2: consolidado por producto (unidades y número de pedidos). */
  @Get('productos')
  productos() {
    return this.reportesService.productos();
  }

  /** Informe 3: resumen general. */
  @Get('resumen')
  resumen() {
    return this.reportesService.resumen();
  }
}
