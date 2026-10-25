import { normalizarEmail, toUsuarioPublico } from './auth.mapper';

describe('toUsuarioPublico', () => {
  it('expone id como string y renombra campos al formato del frontend', () => {
    expect(toUsuarioPublico({ id: 7, nombre: 'Ana', email: 'ana@correo.com', rol: 'cliente' })).toEqual({
      id: '7',
      name: 'Ana',
      email: 'ana@correo.com',
      role: 'cliente',
    });
  });
});

describe('normalizarEmail', () => {
  it('quita espacios y pasa a minúsculas', () => {
    expect(normalizarEmail('  Ana@Correo.COM ')).toBe('ana@correo.com');
  });
});
