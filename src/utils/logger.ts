/**
 * Logger centralizado para evitar exposición de información sensible en producción
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';

  private log(level: LogLevel, message: string, data?: unknown) {
    if (this.isDevelopment) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

      switch (level) {
        case 'error':
          console.error(prefix, message, data);
          break;
        case 'warn':
          console.warn(prefix, message, data);
          break;
        case 'info':
          console.info(prefix, message, data);
          break;
        case 'debug':
          console.debug(prefix, message, data);
          break;
      }
    } else {
      // En producción, podrías enviar a un servicio de monitoring
      // como Sentry, LogRocket, o tu propio endpoint de logs
      if (level === 'error') {
        // Ejemplo: enviar a servicio de logs
        // this.sendToMonitoring(message, data);
      }
    }
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data);
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  // Método para logs de red/API
  apiError(endpoint: string, error: unknown) {
    const message = `Error en petición API: ${endpoint}`;
    
    if (this.isDevelopment) {
      this.error(message, error);
    } else {
      // En producción solo loguear información no sensible
      this.error(message, {
        endpoint,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const logger = new Logger();
