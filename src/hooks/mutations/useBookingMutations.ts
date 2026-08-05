/**
 * Mutations para manejo de bookings
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addBookingRequest, updateBookingRequest, deleteBookingRequest } from '@/api/bookingsApi';
import { queryKeys } from '@/lib/queryClient';
import { logger } from '@/utils/logger';
import { useAuth } from '@/context/AuthContext';
import { CreateBooking } from '@/types';

export const useAddBooking = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (booking: CreateBooking) => {
            logger.debug('Creando booking', { booking });
            return await addBookingRequest(booking);
        },
        onSuccess: () => {
            // Invalidar bookings del usuario y del técnico
            queryClient.invalidateQueries({ queryKey: queryKeys.bookings.user(user?.id) });
            if (user?.technician?.id) {
                queryClient.invalidateQueries({ queryKey: queryKeys.bookings.technician(user.technician.id) });
            }
            logger.info('Booking creado exitosamente');
        },
    });
};

export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({ id, booking }: { id: number; booking: CreateBooking }) => {
            logger.debug('Actualizando booking', { id, booking });
            return await updateBookingRequest(id, booking);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.bookings.user(user?.id) });
            if (user?.technician?.id) {
                queryClient.invalidateQueries({ queryKey: queryKeys.bookings.technician(user.technician.id) });
            }
            logger.info('Booking actualizado exitosamente');
        },
    });
};

export const useDeleteBooking = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (id: number) => {
            logger.debug('Eliminando booking', { id });
            return await deleteBookingRequest(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.bookings.user(user?.id) });
            if (user?.technician?.id) {
                queryClient.invalidateQueries({ queryKey: queryKeys.bookings.technician(user.technician.id) });
            }
            logger.info('Booking eliminado exitosamente');
        },
    });
};
