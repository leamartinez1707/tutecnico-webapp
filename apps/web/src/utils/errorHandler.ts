import { isAxiosError } from "axios";
import { logger } from "./logger";
import { RateLimitError } from "./rateLimiter";

/**
 * Interfaz para respuesta de error estandarizada
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: string[];
  isRateLimited?: boolean;
}

/**
 * Maneja errores de peticiones API de forma centralizada
 * Proporciona mensajes amigables al usuario sin exponer información sensible
 * 
 * @param error - Error capturado
 * @param endpoint - Endpoint que generó el error (para logging)
 * @returns Objeto de error estandarizado
 */
export function handleApiError(error: unknown, endpoint: string): ApiError {
  // Log del error (solo en desarrollo)
  logger.apiError(endpoint, error);

  // Error de rate limiting (frontend)
  if (error instanceof RateLimitError) {
    return {
      message: `Demasiadas peticiones. Por favor espera ${error.waitTimeSeconds} segundos antes de intentar nuevamente.`,
      statusCode: 429,
      isRateLimited: true
    };
  }

  // Error de Axios (petición HTTP)
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    const serverMessage = error.response?.data?.message;

    // Mensajes específicos por código de estado
    switch (statusCode) {
      case 400:
        return {
          message: serverMessage || "Los datos enviados no son válidos",
          statusCode,
          errors: error.response?.data?.errors,
        };
      case 401:
        return {
          message: "No estás autorizado. Por favor, inicia sesión nuevamente",
          statusCode,
        };
      case 403:
        return {
          message: "No tienes permisos para realizar esta acción",
          statusCode,
        };
      case 404:
        return {
          message: "El recurso solicitado no fue encontrado",
          statusCode,
        };
      case 409:
        return {
          message: serverMessage || "Ya existe un recurso con esos datos",
          statusCode,
        };
      case 422:
        return {
          message: "Los datos proporcionados no son válidos",
          statusCode,
          errors: error.response?.data?.errors,
        };
      case 429:
        return {
          message: "Demasiadas peticiones. Por favor, intenta más tarde",
          statusCode,
        };
      case 500:
      case 502:
      case 503:
        return {
          message: "Error del servidor. Por favor, intenta más tarde",
          statusCode,
        };
      default:
        return {
          message: serverMessage || "Ocurrió un error inesperado",
          statusCode,
        };
    }
  }

  // Error de red (sin respuesta del servidor)
  if (error instanceof Error) {
    if (error.message.includes("Network Error")) {
      return {
        message: "Error de conexión. Verifica tu conexión a internet",
      };
    }
    
    // Error genérico
    return {
      message: "Ocurrió un error inesperado. Por favor, intenta nuevamente",
    };
  }

  // Error desconocido
  return {
    message: "Ocurrió un error inesperado",
  };
}

/**
 * Extrae el mensaje de error de forma segura
 * 
 * @param error - Error capturado
 * @param defaultMessage - Mensaje por defecto si no se puede extraer
 * @returns Mensaje de error
 */
export function getErrorMessage(error: unknown, defaultMessage: string = "Error desconocido"): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || defaultMessage;
  }
  
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  
  return defaultMessage;
}
