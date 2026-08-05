/**
 * Hooks para obtener bookings con React Query
 */

import { useQuery } from '@tanstack/react-query';
import { getUserBookingsRequest, getBookingsRequest } from '@/api/bookingsApi';
import { queryKeys } from '@/lib/queryClient';
import { logger } from '@/utils/logger';
import { useAuth } from '@/context/AuthContext';

/**
 * Obtener bookings del usuario autenticado
 */
export const useUserBookings = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: queryKeys.bookings.user(user?.id),
        queryFn: async () => {
            if (!user?.username) return [];
            logger.debug('Cargando bookings del usuario', { username: user.username });
            return await getUserBookingsRequest(user.username);
        },
        enabled: !!user?.username,
    });
};

/**
 * Obtener bookings del técnico autenticado
 */
export const useTechnicianBookings = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: queryKeys.bookings.technician(user?.technician?.id),
        queryFn: async () => {
            if (!user?.username) return [];
            logger.debug('Cargando bookings del técnico', { username: user.username });
            return await getBookingsRequest(user.username);
        },
        enabled: !!user?.technician?.id,
        placeholderData: []
    });
};
