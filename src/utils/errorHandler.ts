import { isAxiosError } from "axios";
import { logger } from "./logger";
import { RateLimitError } from "./rateLimiter";
import i18n from "../config/i18n";

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
      message: i18n.t('errors.rateLimitWait', { seconds: error.waitTimeSeconds }),
      statusCode: 429,
      isRateLimited: true
    };
  }

  // Error de Axios (petición HTTP)
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    const responseData = error.response?.data;
    
    // NestJS puede devolver el mensaje en diferentes formatos:
    // 1. { message: string }
    // 2. { message: string[] }
    // 3. { message: string, error: string, statusCode: number }
    let serverMessage = "";
    
    if (responseData?.message) {
      if (Array.isArray(responseData.message)) {
        serverMessage = responseData.message[0]; // Tomar el primer mensaje
      } else {
        serverMessage = responseData.message;
      }
    }

    // Mensajes específicos por código de estado
    switch (statusCode) {
      case 400:
        return {
          message: serverMessage || i18n.t('errors.invalidData'),
          statusCode,
          errors: Array.isArray(responseData?.message) ? responseData.message : undefined,
        };
      case 401:
        return {
          message: serverMessage || i18n.t('errors.unauthorized'),
          statusCode,
        };
      case 403:
        return {
          message: serverMessage || i18n.t('errors.forbidden'),
          statusCode,
        };
      case 404:
        return {
          message: serverMessage || i18n.t('errors.notFound'),
          statusCode,
        };
      case 409:
        return {
          message: serverMessage || i18n.t('errors.conflict'),
          statusCode,
        };
      case 422:
        return {
          message: serverMessage || i18n.t('errors.unprocessableEntity'),
          statusCode,
          errors: Array.isArray(responseData?.message) ? responseData.message : undefined,
        };
      case 429:
        return {
          message: i18n.t('errors.rateLimitGeneral'),
          statusCode,
        };
      case 500:
      case 502:
      case 503:
        return {
          message: i18n.t('errors.serverError'),
          statusCode,
        };
      default:
        return {
          message: serverMessage || i18n.t('errors.unexpectedError'),
          statusCode,
        };
    }
  }

  // Error de red (sin respuesta del servidor)
  if (error instanceof Error) {
    if (error.message.includes("Network Error")) {
      return {
        message: i18n.t('errors.networkError'),
      };
    }
    
    // Error genérico
    return {
      message: i18n.t('errors.unexpectedErrorRetry'),
    };
  }

  // Error desconocido
  return {
    message: i18n.t('errors.unexpectedError'),
  };
}

/**
 * Extrae el mensaje de error de forma segura
 * 
 * @param error - Error capturado
 * @param defaultMessage - Mensaje por defecto si no se puede extraer
 * @returns Mensaje de error
 */
export function getErrorMessage(error: unknown, defaultMessage: string = i18n.t('errors.unknownError')): string {
  if (isAxiosError(error)) {
    const responseData = error.response?.data;
    
    // NestJS puede devolver el mensaje en diferentes formatos
    if (responseData?.message) {
      if (Array.isArray(responseData.message)) {
        return responseData.message[0]; // Tomar el primer mensaje
      }
      return responseData.message;
    }
    
    return error.message || defaultMessage;
  }
  
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  
  return defaultMessage;
}
