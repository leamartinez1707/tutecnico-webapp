import axios from 'axios';
import Cookies from 'js-cookie';
import { logger } from '../utils/logger';
import { rateLimiter, RateLimitError } from '../utils/rateLimiter';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        // Verificar rate limiting antes de hacer la petición
        // Extraer solo la ruta base sin query params ni IDs
        let endpoint = config.url || '';
        // Remover query params
        endpoint = endpoint.split('?')[0];
        // Remover IDs numéricos del final (ej: /bookings/123 -> /bookings)
        endpoint = endpoint.replace(/\/\d+$/, '');
        
        if (!rateLimiter.canMakeRequest(endpoint)) {
            const waitTime = rateLimiter.getRemainingBlockTime(endpoint);
            const error = new RateLimitError(endpoint, waitTime);
            logger.warn('Petición bloqueada por rate limiting', {
                endpoint,
                waitTime,
                method: config.method
            });
            return Promise.reject(error);
        }

        const token = Cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

// 🔄 Interceptor para manejar expiración del token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Si es un error de rate limiting, no tiene originalRequest.url
        if (!error.config) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        logger.debug('Interceptor de respuesta activado', {
            status: error.response?.status,
            url: originalRequest?.url,
        });

        if (
            error.response?.status === 401 &&
            !originalRequest._retry // prevenir bucles infinitos
        ) {
            originalRequest._retry = true;

            try {
                const refresh_token = Cookies.get('refresh_token');
                if (!refresh_token) {
                    logger.warn('No refresh token disponible, limpiando sesión');
                    // Si no hay refresh token, solo limpia los tokens y rechaza el error
                    Cookies.remove('access_token');
                    Cookies.remove('refresh_token');
                    return Promise.reject(error);
                }
                const { data } = await api.post(
                    import.meta.env.VITE_API_URL + 'auth/refresh',
                    { refresh_token },
                );
                const newAccessToken = data.access_token;
                const newRefreshToken = data.refresh_token;

                Cookies.set('access_token', newAccessToken)
                Cookies.set('refresh_token', newRefreshToken)

                logger.info('Token refrescado exitosamente');
                // Reintentamos la petición original con el nuevo token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                logger.error('Error al refrescar token', refreshError);
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;


