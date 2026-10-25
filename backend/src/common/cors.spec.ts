import { parseAllowedOrigins } from './cors';

describe('parseAllowedOrigins', () => {
  it('separa por coma y quita espacios', () => {
    expect(parseAllowedOrigins('http://a.com, http://b.com')).toEqual(['http://a.com', 'http://b.com']);
  });

  it('devuelve lista vacía si no hay valor', () => {
    expect(parseAllowedOrigins(undefined)).toEqual([]);
    expect(parseAllowedOrigins(' , ')).toEqual([]);
  });
});
