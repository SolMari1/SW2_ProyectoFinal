import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Categoria, Talla } from '../../generated/prisma/client';

export class CrearProductoDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nombre: string;

  @IsString()
  @MaxLength(1000)
  descripcion: string;

  @IsInt()
  @Min(1)
  precio: number;

  @IsEnum(Categoria)
  categoria: Categoria;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(Talla, { each: true })
  tallas: Talla[];

  @IsString()
  @MaxLength(500)
  imagen: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  tiempoEntregaEstimado?: string;
}

export class ActualizarProductoDto extends PartialType(CrearProductoDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class FiltroProductosDto {
  @IsOptional()
  @IsEnum(Categoria)
  categoria?: Categoria;
}
