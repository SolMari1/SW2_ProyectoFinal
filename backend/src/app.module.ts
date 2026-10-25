import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductosModule } from './productos/productos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ReportesModule } from './reportes/reportes.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, AuthModule, ProductosModule, PedidosModule, ReportesModule, HealthModule],
})
export class AppModule {}
