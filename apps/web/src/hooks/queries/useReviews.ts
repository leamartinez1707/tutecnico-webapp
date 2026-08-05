/**
 * Hooks para obtener reviews con React Query
 */

import { useQuery } from '@tanstack/react-query';
import { getAllReviewsRequest, getTechnicianReviewsByUsernameRequest, getUserReviewsByUsernameRequest } from '@/api/reviewsApi';
import { queryKeys } from '@/lib/queryClient';
import { logger } from '@/utils/logger';

/**
 * Obtener todas las reviews del sistema
 */
export const useAllReviews = () => {
    return useQuery({
        queryKey: queryKeys.reviews.all,
        queryFn: async () => {
            logger.debug('Cargando todas las reviews');
            return await getAllReviewsRequest();
        },
    });
};

/**
 * Obtener reviews de un técnico específico por username
 */
export const useReviewsByTechnician = (username: string | undefined) => {
    return useQuery({
        queryKey: queryKeys.reviews.byTechnician(username || ''),
        queryFn: async () => {
            if (!username) return [];
            logger.debug('Cargando reviews de técnico', { username });
            return await getTechnicianReviewsByUsernameRequest(username);
        },
        enabled: !!username,
    });
};

/**
 * Obtener reviews escritas por un usuario específico
 */
export const useUserReviews = (username: string) => {
    return useQuery({
        queryKey: queryKeys.reviews.byUser(username),
        queryFn: async () => {
            logger.debug('Cargando reviews de usuario', { username });
            return await getUserReviewsByUsernameRequest(username);
        },
        enabled: !!username,
    });
};
