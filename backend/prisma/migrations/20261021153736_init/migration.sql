-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('cliente', 'admin');

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('Camisas', 'Pantalones', 'Buzos');

-- CreateEnum
CREATE TYPE "Talla" AS ENUM ('S', 'M', 'L', 'XL');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'ENVIADO', 'COMPLETADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'cliente',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "tallas" "Talla"[],
    "imagen" TEXT NOT NULL,
    "tiempo_entrega_estimado" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" INTEGER NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'EN_PROCESO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_pedido" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "talla" "Talla" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,

    CONSTRAINT "detalle_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "pedidos_cliente_id_idx" ON "pedidos"("cliente_id");

-- CreateIndex
CREATE INDEX "pedidos_fecha_idx" ON "pedidos"("fecha");

-- CreateIndex
CREATE INDEX "detalle_pedido_pedido_id_idx" ON "detalle_pedido"("pedido_id");

-- CreateIndex
CREATE INDEX "detalle_pedido_producto_id_idx" ON "detalle_pedido"("producto_id");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "detalle_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "detalle_pedido_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
