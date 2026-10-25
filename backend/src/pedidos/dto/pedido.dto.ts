import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsIn, IsInt, Max, Min, ValidateNested } from 'class-validator';
import { Talla } from '../../generated/prisma/client';
import { ESTADOS_LABELS } from '../pedido.mapper';

export class ItemPedidoDto {
  @IsInt()
  @Min(1)
  productoId: number;

  @IsEnum(Talla, { message: 'Talla inválida' })
  talla: Talla;

  @IsInt()
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  @Max(100)
  cantidad: number;
}

export class CrearPedidoDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'El pedido debe tener al menos un producto' })
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  items: ItemPedidoDto[];
}

export class CambiarEstadoDto {
  @IsIn(ESTADOS_LABELS, { message: `El estado debe ser uno de: ${ESTADOS_LABELS.join(', ')}` })
  estado: string;
}
