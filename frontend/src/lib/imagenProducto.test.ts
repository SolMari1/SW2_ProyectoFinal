import { describe, expect, it } from 'vitest';
import { IMAGEN_PLACEHOLDER, esUrlAbsoluta, resolverImagen } from './imagenProducto';

const locales = {
  '../assets/productos/camisacuadros.jpg': '/assets/camisacuadros-abc123.jpg',
  '../assets/productos/Buzo.png': '/assets/buzo-def456.png'
};

describe('esUrlAbsoluta', () => {
  it('detecta URLs http, https, protocol-relative y data', () => {
    expect(esUrlAbsoluta('https://images.unsplash.com/x.jpg')).toBe(true);
    expect(esUrlAbsoluta('http://a.com/x.jpg')).toBe(true);
    expect(esUrlAbsoluta('//cdn.com/x.jpg')).toBe(true);
    expect(esUrlAbsoluta('data:image/png;base64,AAA')).toBe(true);
    expect(esUrlAbsoluta('camisacuadros.jpg')).toBe(false);
  });
});

describe('resolverImagen', () => {
  it('deja las URLs tal cual', () => {
    expect(resolverImagen('https://a.com/x.jpg', locales)).toBe('https://a.com/x.jpg');
  });

  it('resuelve nombres de archivo locales sin importar mayúsculas', () => {
    expect(resolverImagen('camisacuadros.jpg', locales)).toBe('/assets/camisacuadros-abc123.jpg');
    expect(resolverImagen('buzo.PNG', locales)).toBe('/assets/buzo-def456.png');
  });

  it('no confunde archivos con nombre parecido', () => {
    expect(resolverImagen('cuadros.jpg', locales)).toBe(IMAGEN_PLACEHOLDER);
  });

  it('usa el placeholder si no existe o está vacía', () => {
    expect(resolverImagen('no-existe.jpg', locales)).toBe(IMAGEN_PLACEHOLDER);
    expect(resolverImagen('', locales)).toBe(IMAGEN_PLACEHOLDER);
  });
});
