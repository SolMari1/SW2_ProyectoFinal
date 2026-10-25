import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { mensajeDeError } from './errores';

const errorConRespuesta = (data: unknown) =>
  new AxiosError('fallo', 'ERR', undefined, undefined, {
    data,
    status: 400,
    statusText: 'Bad Request',
    headers: {},
    config: { headers: new AxiosHeaders() }
  });

describe('mensajeDeError', () => {
  it('usa el mensaje del backend', () => {
    expect(mensajeDeError(errorConRespuesta({ message: 'Email o contraseña incorrectos' }), 'x')).toBe(
      'Email o contraseña incorrectos'
    );
  });

  it('une los mensajes de validación', () => {
    expect(mensajeDeError(errorConRespuesta({ message: ['a', 'b'] }), 'x')).toBe('a. b');
  });

  it('avisa si no hay conexión', () => {
    expect(mensajeDeError(new AxiosError('Network Error'), 'x')).toBe('No se pudo conectar con el servidor');
  });

  it('usa el mensaje por defecto en otros casos', () => {
    expect(mensajeDeError(errorConRespuesta({}), 'Por defecto')).toBe('Por defecto');
    expect(mensajeDeError(new Error('otro'), 'Por defecto')).toBe('Por defecto');
  });
});
