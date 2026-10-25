// Resuelve la imagen de un producto: puede ser una URL o el nombre de un archivo en src/assets/productos

const PLACEHOLDER = 'https://placehold.co/400x300?text=Sin+imagen';

// Carga todas las imágenes de assets/productos como URLs
const IMAGENES_LOCALES = import.meta.glob('../assets/productos/*.{jpg,jpeg,png,webp,avif,gif,svg}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

export const esUrlAbsoluta = (imagen: string): boolean => /^(https?:)?\/\//i.test(imagen) || imagen.startsWith('data:');

export const resolverImagen = (imagen: string, locales: Record<string, string>): string => {
  if (!imagen) return PLACEHOLDER;
  if (esUrlAbsoluta(imagen)) return imagen;

  const nombre = imagen.toLowerCase();
  const encontrada = Object.entries(locales).find(([ruta]) => ruta.toLowerCase().endsWith(`/${nombre}`));
  return encontrada ? encontrada[1] : PLACEHOLDER;
};

export const resolverImagenProducto = (imagen: string): string => resolverImagen(imagen, IMAGENES_LOCALES);

export { PLACEHOLDER as IMAGEN_PLACEHOLDER };
