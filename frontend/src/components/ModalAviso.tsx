// Modal genérico para avisos y confirmaciones (reemplaza alert/confirm del navegador)
import { useEffect, type FC, type ReactNode } from 'react';

interface ModalAvisoProps {
  abierto: boolean;
  titulo: string;
  children: ReactNode;
  textoConfirmar?: string;
  onConfirmar?: () => void;
  textoCancelar?: string;
  onCerrar: () => void;
}

export const ModalAviso: FC<ModalAvisoProps> = ({
  abierto,
  titulo,
  children,
  textoConfirmar = 'Aceptar',
  onConfirmar,
  textoCancelar,
  onCerrar
}) => {
  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!abierto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="modal-fondo" onClick={onCerrar} role="dialog" aria-modal="true" aria-labelledby="modal-aviso-titulo">
      <div className="modal-tarjeta modal-aviso" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-boton-cerrar" onClick={onCerrar} aria-label="Cerrar modal">
          ✕
        </button>

        <h2 id="modal-aviso-titulo" className="modal-aviso__titulo">
          {titulo}
        </h2>
        <div className="modal-aviso__mensaje">{children}</div>

        <div className="modal-aviso__acciones">
          {textoCancelar && (
            <button type="button" className="btn-modal-volver" onClick={onCerrar}>
              {textoCancelar}
            </button>
          )}
          <button
            type="button"
            className="btn-modal-agregar-carrito"
            onClick={onConfirmar ?? onCerrar}
            autoFocus
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAviso;
