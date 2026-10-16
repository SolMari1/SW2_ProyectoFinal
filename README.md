#Proyecto Final SW2
# Frontend 
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
#cada vez que se vaya a trabajar
4.Traer lo último de main
git checkout main
git pull origin main
5. Agregar los archivos
git add .
6. Hacer el commit (con mensaje descriptivo)
git commit -m "agrego tal cosa"
7.Subir a GitHub
git push origin 


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
