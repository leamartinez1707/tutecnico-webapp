/**
 * Configuración centralizada de TanStack Query
 * Optimizado para rendimiento y seguridad
 */

import { QueryClient } from '@tanstack/react-query';
import { logger } from '@/utils/logger';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Caché por 5 minutos (datos relativamente estables)
            staleTime: 5 * 60 * 1000,

            // Mantener en memoria 10 minutos
            gcTime: 10 * 60 * 1000,

            // Reintentar solo una vez en caso de error
            retry: 1,

            // No refetch automático al volver a la ventana
            refetchOnWindowFocus: false,

            // No refetch al reconectar (evitar peticiones innecesarias)
            refetchOnReconnect: false,

            // No refetch al montar (usar caché si está disponible)
            refetchOnMount: false,
        },
        mutations: {
            // No reintentar mutaciones automáticamente
            retry: false,

            // Handler global de errores
            onError: (error) => {
                logger.error('Mutation error', error);
            },
        },
    },
});

// Query Keys centralizadas para consistencia
export const queryKeys = {
    technicians: {
        all: ['technicians'] as const,
        lists: () => [...queryKeys.technicians.all, 'list'] as const,
        list: (filters?: Record<string, unknown>) => [...queryKeys.technicians.lists(), filters] as const,
        detail: (username: string) => [...queryKeys.technicians.all, 'detail', username] as const,
        recent: (limit: number) => [...queryKeys.technicians.all, 'recent', limit] as const,
    },
    reviews: {
        all: ['reviews'] as const,
        lists: () => [...queryKeys.reviews.all, 'list'] as const,
        byUser: (username: string) => [...queryKeys.reviews.all, 'user', username] as const,
        byTechnician: (username: string) => [...queryKeys.reviews.all, 'technician', username] as const,
    },
    favorites: {
        all: ['favorites'] as const,
        user: (userId?: number) => [...queryKeys.favorites.all, userId] as const,
    },
    specializations: {
        all: ['specializations'] as const
    },
    bookings: {
        all: ['bookings'] as const,
        user: (userId?: number) => [...queryKeys.bookings.all, 'user', userId] as const,
        technician: (techId?: number) => [...queryKeys.bookings.all, 'technician', techId] as const,
    },
} as const;
