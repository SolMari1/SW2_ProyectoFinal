// Seed idempotente: se puede correr varias veces sin duplicar datos.
// Uso: npm run prisma:seed
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { PEDIDOS, PRODUCTOS, USUARIOS, fechaSeed, lineasSeed, totalSeed } from './seed-data';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  for (const { password, ...usuario } of USUARIOS) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.usuario.upsert({
      where: { email: usuario.email },
      update: { nombre: usuario.nombre, rol: usuario.rol, passwordHash },
      create: { ...usuario, passwordHash },
    });
  }

  for (const producto of PRODUCTOS) {
    await prisma.producto.upsert({ where: { id: producto.id }, update: producto, create: producto });
  }

  for (const pedido of PEDIDOS) {
    const datos = {
      clienteId: pedido.clienteId,
      fecha: fechaSeed(pedido.fecha),
      estado: pedido.estado,
      total: totalSeed(pedido),
    };
    await prisma.$transaction([
      prisma.pedido.upsert({ where: { id: pedido.id }, update: datos, create: { id: pedido.id, ...datos } }),
      prisma.detallePedido.deleteMany({ where: { pedidoId: pedido.id } }),
      prisma.detallePedido.createMany({ data: lineasSeed(pedido).map((l) => ({ ...l, pedidoId: pedido.id })) }),
    ]);
  }

  // Con ids explícitos las secuencias no avanzan: se ajustan para que los nuevos registros no choquen
  for (const tabla of ['usuarios', 'productos', 'pedidos', 'detalle_pedido']) {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"${tabla}"', 'id'), GREATEST((SELECT MAX(id) FROM "${tabla}"), 1))`,
    );
  }

  console.log(`Seed listo: ${USUARIOS.length} usuarios, ${PRODUCTOS.length} productos, ${PEDIDOS.length} pedidos`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
