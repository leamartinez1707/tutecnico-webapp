import { logger } from './logger';

/**
 * Configuración global de manejadores de errores
 * Captura errores no manejados y rechazos de promesas
 */
export const setupGlobalErrorHandlers = () => {
  // Manejar errores de JavaScript no capturados
  window.onerror = (message, source, lineno, colno, error) => {
    logger.error('Error global no capturado', {
      message,
      source,
      lineno,
      colno,
      error: error?.message,
      stack: error?.stack,
    });

    // Prevenir que el error se propague y cause pantalla blanca
    return true;
  };

  // Manejar promesas rechazadas no capturadas
  window.onunhandledrejection = (event) => {
    logger.error('Promesa rechazada no manejada', {
      reason: event.reason,
      promise: event.promise,
    });

    // Prevenir que el error se propague
    event.preventDefault();
  };

  // Log cuando el manejador está configurado
  logger.debug('Manejadores globales de errores configurados');
};

/**
 * Limpiar manejadores globales (útil para testing)
 */
export const cleanupGlobalErrorHandlers = () => {
  window.onerror = null;
  window.onunhandledrejection = null;
};
