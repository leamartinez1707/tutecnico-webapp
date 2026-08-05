/**
 * Hook para obtener favoritos del usuario con React Query
 */

import { useQuery } from '@tanstack/react-query';
import { getUserFavoritesRequest } from '@/api/favoritesApi';
import { queryKeys } from '@/lib/queryClient';
import { logger } from '@/utils/logger';
import { useAuth } from '@/context/AuthContext';

export const useFavorites = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: queryKeys.favorites.user(user?.id),
        queryFn: async () => {
            if (!user?.id) return [];
            logger.debug('Cargando favoritos del usuario', { userId: user.id });
            const favorites = await getUserFavoritesRequest();
            // Asegurar que siempre retornemos un array
            return favorites.items;
        },
        enabled: !!user?.id, // Solo ejecutar si hay usuario autenticado
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
};
