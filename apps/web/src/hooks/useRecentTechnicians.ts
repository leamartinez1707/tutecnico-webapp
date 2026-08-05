import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTechniciansRequest } from '@/api/techApi';
import { Technicians } from '@/types';
import { logger } from '@/utils/logger';
import { queryKeys } from '@/lib/queryClient';

export interface RecentTechnician {
    id: number;
    name: string;
    specialization: string;
    services: string[];
    address: string;
    profilePhotoUrl?: string;
    username: string;
}

export const useRecentTechnicians = (limit: number = 6) => {
    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.technicians.recent(limit),
        queryFn: async () => {
            logger.debug('Cargando técnicos recientes de la API');
            return await getTechniciansRequest();
        },
    });

    // Mapear los datos al formato necesario
    const recentTechnicians = useMemo(() => {
        if (!data?.length) return [];

        return data
            .slice(0, limit)
            .map((tech: Technicians): RecentTechnician => ({
                id: tech.id,
                name: `${tech.firstName} ${tech.lastName}`,
                specialization: tech.specialization,
                services: tech.services || [],
                address: tech.address,
                profilePhotoUrl: tech.profilePhotoUrl,
                username: tech.username,
            }));
    }, [data, limit]);

    return {
        recentTechnicians,
        isLoading,
        error: error ? 'Error al cargar técnicos recientes' : null,
    };
};
