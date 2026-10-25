# Backend SW2

API REST de la tienda, hecha con NestJS, Prisma y PostgreSQL. Corre en `http://localhost:4000/api`.

Si solo quieres levantar el proyecto, usa Docker desde la raíz del repo (`docker compose up --build`); ver el [README principal](../README.md).
Esta guía explica qué hay dentro del backend y cómo manejar la base de datos, las migraciones y la seed.

## Índice

- [Estructura](#estructura)
- [Variables de entorno](#variables-de-entorno)
- [Scripts](#scripts)
- [Seed (datos de prueba)](#seed-datos-de-prueba)
- [Migraciones](#migraciones)
- [Tareas comunes](#tareas-comunes)
- [Tests](#tests)
- [Problemas frecuentes](#problemas-frecuentes)

## Estructura

```
backend/
├── prisma/
│   ├── schema.prisma        # Modelo de datos (tablas, enums, relaciones)
│   ├── migrations/          # SQL generado por Prisma; NO editar a mano
│   ├── seed.ts              # Script que inserta los datos de prueba
│   ├── seed-data.ts         # Los datos: usuarios, productos y pedidos
│   └── seed-data.spec.ts    # Tests de consistencia de la seed
├── prisma.config.ts         # Config de Prisma (schema, migraciones, comando de seed)
├── src/
│   ├── main.ts              # Arranque: prefijo /api, CORS, validación
│   ├── auth/                # Login, registro, JWT y roles
│   ├── productos/           # Catálogo
│   ├── pedidos/             # Pedidos y cálculo de líneas/totales
│   ├── reportes/            # Los 3 informes del administrador
│   ├── health/              # GET /api/health
│   ├── prisma/              # Conexión a la BD (PrismaService)
│   ├── common/              # CORS y manejo de errores de Prisma
│   └── generated/prisma/    # Cliente de Prisma generado (no se sube a git)
├── Dockerfile
└── .env.example
```

Cada módulo sigue el patrón de NestJS: `*.controller.ts` (rutas), `*.service.ts` (lógica y BD), `dto/` (validación de entrada) y `*.mapper.ts` (convierte lo de la BD al formato que espera el frontend).

## Variables de entorno

Con Docker no hace falta configurar nada: `docker-compose.yml` ya las define.
Para correr el backend sin Docker, copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

| Variable | Ejemplo | Descripción |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://sw2:sw2password@localhost:5432/sw2?schema=public` | Conexión a PostgreSQL |
| `JWT_SECRET` | `cambia-este-secreto` | Clave para firmar los tokens. **Obligatoria**; usa una larga y secreta en producción |
| `JWT_EXPIRES_IN` | `1d` | Duración del token (`1h`, `7d`, …) |
| `PORT` | `4000` | Puerto de la API |
| `NODE_ENV` | `development` | En `production` solo se aceptan los orígenes de `ALLOWED_ORIGINS` |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Orígenes permitidos por CORS en producción, separados por coma |

> Si usas el Postgres de Docker desde tu máquina, el puerto de `DATABASE_URL` es el de `DB_PORT` en el `.env` de la raíz (por defecto `5432`).

## Scripts

Se corren dentro de `backend/` con `npm run <script>`.

| Script | Qué hace |
| --- | --- |
| `start:dev` | Levanta la API con recarga automática |
| `build` | Compila a `dist/` |
| `start:prod` | Corre la versión compilada |
| `test` | Ejecuta los tests (Jest) |
| `prisma:generate` | Regenera el cliente de Prisma (después de cambiar `schema.prisma`) |
| `prisma:migrate` | Crea y aplica una migración nueva (`prisma migrate dev`) |
| `prisma:deploy` | Aplica las migraciones pendientes sin crear nuevas |
| `prisma:seed` | Carga los datos de prueba |
| `prisma:studio` | Abre Prisma Studio para ver y editar la BD en el navegador |

## Seed (datos de prueba)

La seed llena la base de datos con los mismos datos que tenía el frontend en sus mocks.

### Qué carga

**Usuarios**

| ID | Nombre | Email | Contraseña | Rol |
| --- | --- | --- | --- | --- |
| 1 | Carlos Mendoza | cliente1@correo.com | password123 | cliente |
| 2 | Andrea Gómez | cliente2@correo.com | password123 | cliente |
| 3 | Administrador SW2 | admin@correo.com | adminpassword | admin |

**Productos**: 9 prendas (ids 1 a 9): 3 camisas, 3 pantalones y 3 buzos, todas en tallas S, M, L y XL.

**Pedidos**: 12 pedidos históricos.
- Carlos: `PED-1001` a `PED-1006`
- Andrea: `PED-2001` a `PED-2006`
- Estados variados: Completado, Enviado, En proceso y Pendiente.
- El precio unitario de esos pedidos es el que tenía la prenda cuando se compró, por eso no coincide con el precio actual del catálogo.

Los pedidos nuevos que se creen desde la app siguen la numeración desde `PED-2007`.

### Cómo correrla

**Con Docker:** no hay que hacer nada. Cada vez que arranca el contenedor del backend se ejecuta, en orden:

```
prisma generate → prisma migrate deploy → prisma db seed → start:dev
```

Para volver a correrla con el stack ya levantado:

```bash
docker compose exec backend npm run prisma:seed
```

**Sin Docker:**

```bash
cd backend
npx prisma migrate deploy   # primero deben existir las tablas
npm run prisma:seed
```

Salida esperada:

```
Seed listo: 3 usuarios, 9 productos, 12 pedidos
```

### Es idempotente

Se puede correr todas las veces que quieras sin duplicar datos:

- Usuarios: se buscan por email y se actualizan si ya existen.
- Productos y pedidos: se buscan por id y se actualizan si ya existen. Las líneas de cada pedido de la seed se reemplazan.
- Al final se ajustan los contadores de ids de Postgres, para que los registros nuevos no choquen con los de la seed.

**Ojo:** como se actualizan, cualquier cambio que hagas desde la app a un dato de la seed se revierte al volver a correrla. Con Docker eso pasa cada vez que reinicias el backend. Por ejemplo, si cambias el estado de `PED-2006`, vuelve a "Pendiente".
Lo que no es de la seed (usuarios registrados, pedidos nuevos) no se toca.

### Cómo modificarla

1. Edita los arreglos `USUARIOS`, `PRODUCTOS` o `PEDIDOS` en `prisma/seed-data.ts`.
2. Corre `npm test` para verificar que todo es consistente: cada pedido usa clientes, productos y tallas que existen, y los emails no se repiten.
   - Si cambiaste pedidos, actualiza también los totales esperados en `prisma/seed-data.spec.ts`.
3. Corre la seed: `npm run prisma:seed`.

Para agregar una imagen local a un producto:

1. Pon el archivo en `frontend/src/assets/productos/`.
2. En la seed, escribe solo el nombre del archivo en `imagen`, por ejemplo `imagen: 'camisacuadros.jpg'`.

El frontend lo resuelve solo. También sirve una URL completa (`https://...`).

## Migraciones

El modelo de datos vive en `prisma/schema.prisma`. Cada cambio al modelo debe ir acompañado de una migración, que es el SQL que lleva la base de datos de un estado al siguiente.

### Cambiar el modelo

```bash
cd backend
# 1. Editar prisma/schema.prisma
# 2. Crear y aplicar la migración (pide un nombre descriptivo)
npx prisma migrate dev --name agregar_stock_a_productos
```

Esto crea `prisma/migrations/<fecha>_agregar_stock_a_productos/migration.sql`, lo aplica a tu BD y regenera el cliente.
**Sube la carpeta de la migración a git**: tus compañeros la aplicarán al hacer `pull` y reiniciar el backend.

Con Docker:

```bash
docker compose exec backend npx prisma migrate dev --name agregar_stock_a_productos
```

### Aplicar migraciones de otros

Con Docker se aplican solas al reiniciar el backend (`docker compose restart backend`). Sin Docker:

```bash
npx prisma migrate deploy
```

### Reglas

- Nunca edites ni borres una migración que ya está en `main`; crea una nueva.
- Si dos personas crean migraciones a la vez, la segunda en hacer merge debe regenerar la suya sobre la última de `main`.

## Tareas comunes

### Ver la base de datos

Prisma Studio se corre desde tu máquina, no dentro del contenedor. Necesita `npm install` en `backend/` y un `.env` cuyo `DATABASE_URL` apunte al Postgres de Docker, con el puerto `DB_PORT`:

```bash
cd backend
npm install
cp .env.example .env    # ajustar el puerto de DATABASE_URL si DB_PORT no es 5432
npm run prisma:studio
```

Abre http://localhost:5555.

También puedes conectarte con DBeaver, pgAdmin o `psql`:

| Dato | Valor |
| --- | --- |
| Host | `localhost` |
| Puerto | `DB_PORT` del `.env` de la raíz (por defecto `5432`) |
| Base | `sw2` |
| Usuario | `sw2` |
| Contraseña | `sw2password` |

```bash
docker compose exec db psql -U sw2 -d sw2
```

### Borrar todo y empezar de cero

**Con Docker.** Esto borra el volumen de la base de datos; al levantar, se recrean las tablas y se carga la seed:

```bash
docker compose down -v
docker compose up --build
```

**Sin Docker:**

```bash
npx prisma migrate reset   # borra la BD y vuelve a aplicar las migraciones
npm run prisma:seed        # carga los datos de prueba
```

### Probar la API a mano

```bash
# Login (guarda el token de la respuesta)
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"cliente1@correo.com","password":"password123"}'

# Usar el token
curl http://localhost:4000/api/pedidos/mios -H 'Authorization: Bearer <TOKEN>'

# Crear un pedido
curl -X POST http://localhost:4000/api/pedidos \
  -H 'Authorization: Bearer <TOKEN>' -H 'Content-Type: application/json' \
  -d '{"items":[{"productoId":1,"talla":"M","cantidad":2}]}'
```

La lista completa de endpoints está en el [README principal](../README.md#api-rest).

## Tests

```bash
npm test                         # todos
npx jest src/pedidos             # solo una carpeta
npx jest --watch                 # modo watch
```

Los tests (`*.spec.ts`) cubren las funciones puras:

- Cálculo de líneas y totales de pedidos.
- Formatos de respuesta (mappers).
- Cálculos de los informes.
- Guard de roles.
- Consistencia de la seed.

## Problemas frecuentes

| Síntoma | Solución |
| --- | --- |
| `port is already allocated` / `address already in use` al hacer `docker compose up` | Otro programa usa ese puerto. Copia `.env.example` a `.env` en la raíz y cambia `DB_PORT` o `FRONTEND_PORT` |
| `Cannot find module '../generated/prisma/client'` | Falta generar el cliente: `npm run prisma:generate` |
| `P1000: Authentication failed` | El usuario o la clave de `DATABASE_URL` no coinciden con los de la BD |
| `P1001: Can't reach database server` | La BD no está corriendo, o el host/puerto de `DATABASE_URL` está mal |
| `The table ... does not exist` | Faltan migraciones: `npx prisma migrate deploy` |
| `JWT_SECRET es obligatorio` | Falta `JWT_SECRET` en el `.env` |
| Los cambios a datos de la seed se revierten | Es lo esperado: la seed corre en cada arranque con Docker (ver [Es idempotente](#es-idempotente)) |
| El frontend dice "No se pudo conectar con el servidor" | El backend no está corriendo en `http://localhost:4000`, o `VITE_API_URL` apunta a otra URL |
