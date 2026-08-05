/**
 * Hook para obtener perfil de técnico por username (público)
 */

import { useQuery } from '@tanstack/react-query';
import { getMyDataRequest, getTechDataRequest } from '@/api/techApi';
import { queryClient, queryKeys } from '@/lib/queryClient';
import { logger } from '@/utils/logger';
import { Technicians } from '@/types';

export const useTechnicianByUsername = (username: string) => {
    return useQuery({
        queryKey: queryKeys.technicians.detail(username),
        queryFn: async () => {
            logger.debug('Cargando perfil de técnico', { username });
            return await getTechDataRequest(username);
        },
        enabled: !!username, // Solo ejecutar si hay username
        initialData: () => {
            // Buscar si ya existe en la lista de técnicos
            const technicians = queryClient.getQueryData(
                queryKeys.technicians.lists()
            ) as { items: Technicians[] } | undefined;

            return technicians?.items?.find(t => t.username === username);
        },
    });
};

export const useTechnicianLoggedProfile = () => {
    return useQuery({
        queryKey: queryKeys.technicians.detail('me'),
        queryFn: async () => {
            logger.debug('Cargando perfil de técnico logueado');
            return await getMyDataRequest();
        },
        enabled: true, // Siempre ejecutar para el perfil logueado
    });
};