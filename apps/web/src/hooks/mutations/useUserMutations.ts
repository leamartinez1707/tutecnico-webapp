/**
 * Mutations para actualización de perfil de usuario
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserDataRequest, updateProfilePhotoRequest } from '@/api/usersApi';
import { queryKeys } from '@/lib/queryClient';
import { logger } from '@/utils/logger';
import { useAuth } from '@/context/AuthContext';

interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    phoneNumber?: string;
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (userData: UpdateUserData) => {
            if (!user?.id) throw new Error('Usuario no autenticado');
            logger.debug('Actualizando perfil de usuario', { userId: user.id, userData });
            return await updateUserDataRequest(user.id, userData);
        },
        onSuccess: (data) => {
            // Invalidar queries relacionadas con el usuario
            if (user?.username) {
                queryClient.invalidateQueries({ queryKey: queryKeys.technicians.detail(user.username) });
            }
            logger.info('Perfil actualizado exitosamente', { userId: data.id });
        },
    });
};

export const useUpdateProfilePhoto = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({ userId, photoUrl }: { userId: number; photoUrl: string }) => {
            logger.debug('Actualizando foto de perfil', { userId, photoUrl });
            return await updateProfilePhotoRequest(userId, photoUrl);
        },
        onSuccess: () => {
            // Invalidar queries del técnico para refrescar la foto
            if (user?.username) {
                queryClient.invalidateQueries({ queryKey: queryKeys.technicians.detail(user.username) });
                queryClient.invalidateQueries({ queryKey: queryKeys.technicians.lists() });
            }
            logger.info('Foto de perfil actualizada exitosamente');
        },
    });
};
