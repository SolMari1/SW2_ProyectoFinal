import { Module } from '@nestjs/common';
import { PedidosModule } from '../pedidos/pedidos.module';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';

@Module({
  imports: [PedidosModule],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
