/**
 * Mutations para manejo de favoritos
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserFavoriteRequest, deleteUserFavoriteRequest } from '@/api/favoritesApi';
import { queryKeys } from '@/lib/queryClient';
import { logger } from '@/utils/logger';
import { useAuth } from '@/context/AuthContext';

export const useAddFavorite = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (technicianId: number) => {
            logger.debug('Agregando favorito', { technicianId });
            return await createUserFavoriteRequest(technicianId);
        },
        onSuccess: () => {
            // Invalidar caché de favoritos
            queryClient.invalidateQueries({ queryKey: queryKeys.favorites.user(user?.id) });
            logger.info('Favorito agregado exitosamente');
        },
    });
};

export const useRemoveFavorite = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (favoriteId: number) => {
            logger.debug('Eliminando favorito', { favoriteId });
            return await deleteUserFavoriteRequest(favoriteId);
        },
        onSuccess: () => {
            // Invalidar caché de favoritos
            queryClient.invalidateQueries({ queryKey: queryKeys.favorites.user(user?.id) });
            logger.info('Favorito eliminado exitosamente');
        },
    });
};
