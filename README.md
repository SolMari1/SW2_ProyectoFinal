# Frontend - Proyecto Final SW2

Frontend de la aplicación, construido con React + TypeScript + Vite.

## Tecnologías

- React 18
- TypeScript
- Vite
- React Router
- Axios
- React Hook Form + Zod

## Requisitos

- Node.js 18 o superior
- npm

## Cómo ejecutar el proyecto

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPO>
   cd sw2ProyectoFinal

2. Instalar dependencias:
npm install
3. Correr en modo desarrollo:
npm run dev


##Estructura del proyecto
src/
├── api/          # Configuración de axios y llamadas HTTP
├── components/   # Componentes reutilizables
├── context/      # Contextos (Auth)
├── hooks/        # Hooks personalizados
├── pages/        # Páginas (Login, Register, etc.)
├── types/        # Tipos TypeScript compartidos
├── App.tsx       # Componente raíz con rutas
└── main.tsx      # Punto de entrada
