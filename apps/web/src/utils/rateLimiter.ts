import { logger } from './logger';

/**
 * Configuración de rate limiting por endpoint
 */
interface RateLimitConfig {
  maxRequests: number;  // Máximo de peticiones
  windowMs: number;     // Ventana de tiempo en milisegundos
}

/**
 * Registro de peticiones por endpoint
 */
interface RequestLog {
  timestamps: number[];
  blocked: boolean;
  blockedUntil?: number;
}

/**
 * Clase para controlar rate limiting en el frontend
 * Previene que los usuarios hagan demasiadas peticiones al backend
 * Persiste en localStorage para mantener límites entre refrescos de página
 */
class RateLimiter {
  private requests: Map<string, RequestLog> = new Map();
  private readonly STORAGE_KEY = 'rate_limiter_data';
  private readonly HASH_KEY = 'rate_limiter_hash';
  
  // Configuraciones por defecto
  private defaultConfig: RateLimitConfig = {
    maxRequests: 10,
    windowMs: 60000 // 10 peticiones por minuto
  };

  // Configuraciones específicas por endpoint
  private endpointConfigs: Map<string, RateLimitConfig> = new Map([
    // Autenticación - más restrictivo
    ['/auth/login', { maxRequests: 5, windowMs: 300000 }], // 5 intentos cada 5 minutos
    ['/auth/register', { maxRequests: 3, windowMs: 600000 }], // 3 intentos cada 10 minutos
    ['/auth/refresh', { maxRequests: 10, windowMs: 60000 }], // 10 refreshes por minuto
    
    // Búsqueda y lectura - más permisivo
    ['/technicians', { maxRequests: 30, windowMs: 60000 }], // 30 peticiones por minuto
    ['/users', { maxRequests: 20, windowMs: 60000 }],
    ['/reviews', { maxRequests: 30, windowMs: 60000 }], // 30 reviews por minuto (lectura)
    
    // Creación/modificación - moderado
    ['/bookings', { maxRequests: 15, windowMs: 60000 }], // 15 peticiones por minuto
    ['/favorites', { maxRequests: 20, windowMs: 60000 }],
    
    // Geolocalización - moderado
    ['/geo', { maxRequests: 20, windowMs: 60000 }],
  ]);

  constructor() {
    // Cargar datos persistidos al inicializar
    this.loadFromStorage();
  }

  /**
   * Genera un hash simple de los datos para detectar manipulación
   */
  private generateHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Añadir timestamp del sistema para hacer más difícil la manipulación
    return Math.abs(hash).toString(36);
  }

  /**
   * Carga los datos de rate limiting desde localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const storedHash = localStorage.getItem(this.HASH_KEY);
      
      if (stored && storedHash) {
        const computedHash = this.generateHash(stored);
        
        // Validar que el hash coincida
        if (computedHash !== storedHash) {
          logger.warn('Manipulación detectada en localStorage - limpiando datos de rate limiting');
          localStorage.removeItem(this.STORAGE_KEY);
          localStorage.removeItem(this.HASH_KEY);
          return;
        }
        
        const data = JSON.parse(stored) as Record<string, RequestLog>;
        
        // Validar que los timestamps sean números válidos y no futuros
        const now = Date.now();
        let valid = true;
        
        for (const [, log] of Object.entries(data)) {
          if (!Array.isArray(log.timestamps)) {
            valid = false;
            break;
          }
          // Verificar que los timestamps sean válidos
          for (const ts of log.timestamps) {
            if (typeof ts !== 'number' || ts > now || ts < 0) {
              valid = false;
              break;
            }
          }
          // Verificar blockedUntil si existe
          if (log.blockedUntil && (typeof log.blockedUntil !== 'number' || log.blockedUntil < 0)) {
            valid = false;
            break;
          }
        }
        
        if (!valid) {
          logger.warn('Datos inválidos en localStorage - limpiando');
          localStorage.removeItem(this.STORAGE_KEY);
          localStorage.removeItem(this.HASH_KEY);
          return;
        }
        
        this.requests = new Map(Object.entries(data));
        logger.debug('Rate limiter data cargado desde localStorage');
      }
    } catch (error) {
      logger.error('Error al cargar rate limiter data desde localStorage', error);
      // Limpiar datos corruptos
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.HASH_KEY);
    }
  }

  /**
   * Guarda los datos de rate limiting en localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Object.fromEntries(this.requests);
      const jsonData = JSON.stringify(data);
      const hash = this.generateHash(jsonData);
      
      localStorage.setItem(this.STORAGE_KEY, jsonData);
      localStorage.setItem(this.HASH_KEY, hash);
    } catch (error) {
      logger.error('Error al guardar rate limiter data en localStorage', error);
    }
  }

  /**
   * Verifica si una petición está permitida
   * @param endpoint - URL del endpoint
   * @returns true si la petición está permitida
   */
  canMakeRequest(endpoint: string): boolean {
    const config = this.getConfig(endpoint);
    const now = Date.now();
    
    // Obtener o crear registro de peticiones
    let requestLog = this.requests.get(endpoint);
    if (!requestLog) {
      requestLog = { timestamps: [], blocked: false };
      this.requests.set(endpoint, requestLog);
    }

    // Si está bloqueado, verificar si ya pasó el tiempo
    if (requestLog.blocked && requestLog.blockedUntil) {
      if (now < requestLog.blockedUntil) {
        const remainingMs = requestLog.blockedUntil - now;
        const remainingSec = Math.ceil(remainingMs / 1000);
        logger.warn('Petición bloqueada por rate limiting', {
          endpoint,
          remainingSeconds: remainingSec
        });
        return false;
      } else {
        // Desbloquear
        requestLog.blocked = false;
        requestLog.blockedUntil = undefined;
        requestLog.timestamps = [];
        this.saveToStorage();
      }
    }

    // Limpiar timestamps antiguos (fuera de la ventana)
    requestLog.timestamps = requestLog.timestamps.filter(
      timestamp => now - timestamp < config.windowMs
    );

    // Verificar si excede el límite
    if (requestLog.timestamps.length >= config.maxRequests) {
      const oldestRequest = requestLog.timestamps[0];
      const blockedUntil = oldestRequest + config.windowMs;
      
      requestLog.blocked = true;
      requestLog.blockedUntil = blockedUntil;
      
      const waitTimeMs = blockedUntil - now;
      const waitTimeSec = Math.ceil(waitTimeMs / 1000);
      
      logger.warn('Rate limit excedido', {
        endpoint,
        maxRequests: config.maxRequests,
        windowMs: config.windowMs,
        waitTimeSeconds: waitTimeSec
      });
      
      this.saveToStorage();
      return false;
    }

    // Registrar esta petición
    requestLog.timestamps.push(now);
    this.saveToStorage();
    
    // Debug: log cuando se acerca al límite
    if (requestLog.timestamps.length >= config.maxRequests * 0.7) {
      logger.info('Acercándose al límite de rate limiting', {
        endpoint,
        current: requestLog.timestamps.length,
        max: config.maxRequests
      });
    }
    
    return true;
  }

  /**
   * Obtiene la configuración para un endpoint
   * @param endpoint - URL del endpoint
   * @returns Configuración de rate limiting
   */
  private getConfig(endpoint: string): RateLimitConfig {
    // Buscar coincidencia exacta o por prefijo
    for (const [key, config] of this.endpointConfigs.entries()) {
      if (endpoint.includes(key)) {
        return config;
      }
    }
    return this.defaultConfig;
  }

  /**
   * Obtiene el tiempo restante de bloqueo
   * @param endpoint - URL del endpoint
   * @returns Segundos restantes o 0 si no está bloqueado
   */
  getRemainingBlockTime(endpoint: string): number {
    const requestLog = this.requests.get(endpoint);
    if (!requestLog?.blocked || !requestLog.blockedUntil) {
      return 0;
    }
    
    const now = Date.now();
    const remaining = Math.max(0, requestLog.blockedUntil - now);
    return Math.ceil(remaining / 1000);
  }

  /**
   * Resetea el rate limiting para un endpoint (útil para testing)
   * @param endpoint - URL del endpoint
   */
  reset(endpoint?: string): void {
    if (endpoint) {
      this.requests.delete(endpoint);
      logger.info('Rate limiter reseteado para endpoint', { endpoint });
    } else {
      this.requests.clear();
      logger.info('Rate limiter reseteado completamente');
    }
    this.saveToStorage();
  }

  /**
   * Obtiene estadísticas de uso
   * @param endpoint - URL del endpoint
   * @returns Estadísticas de peticiones
   */
  getStats(endpoint: string): { current: number; max: number; blocked: boolean } {
    const config = this.getConfig(endpoint);
    const requestLog = this.requests.get(endpoint);
    const now = Date.now();

    if (!requestLog) {
      return { current: 0, max: config.maxRequests, blocked: false };
    }

    // Filtrar solo peticiones en la ventana actual
    const recentRequests = requestLog.timestamps.filter(
      timestamp => now - timestamp < config.windowMs
    );

    return {
      current: recentRequests.length,
      max: config.maxRequests,
      blocked: requestLog.blocked || false
    };
  }
}

// Exportar instancia única (singleton)
export const rateLimiter = new RateLimiter();

/**
 * Error personalizado para rate limiting
 */
export class RateLimitError extends Error {
  constructor(
    public endpoint: string,
    public waitTimeSeconds: number
  ) {
    super(`Demasiadas peticiones a ${endpoint}. Espera ${waitTimeSeconds} segundos.`);
    this.name = 'RateLimitError';
  }
}
