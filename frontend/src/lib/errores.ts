// Extrae un mensaje legible de un error de Axios / NestJS
import { isAxiosError } from 'axios';

export const mensajeDeError = (error: unknown, porDefecto: string): string => {
  if (isAxiosError(error)) {
    if (!error.response) return 'No se pudo conectar con el servidor';
    const mensaje: unknown = error.response.data?.message;
    if (Array.isArray(mensaje)) return mensaje.join('. ');
    if (typeof mensaje === 'string' && mensaje) return mensaje;
  }
  return porDefecto;
};
