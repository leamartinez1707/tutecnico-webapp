/**
 * Hook personalizado para manejar filtros sincronizados con URL params
 * La URL es la fuente de verdad para todos los filtros
 */

import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo, useEffect } from 'react';
import { logger } from '@/utils/logger';

export interface UrlFilters {
    search: string;
    specialization: string;
    department: string;
    page: number;
    perPage: number;
}

const DEFAULT_FILTERS: UrlFilters = {
    search: '',
    specialization: 'all',
    department: 'all',
    page: 1,
    perPage: 5,
};

export const useUrlFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Inicializar URL con page=1 si no está presente
    useEffect(() => {
        const page = searchParams.get('page');
        if (!page) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('page', '1');
            setSearchParams(newParams, { replace: true });
        }
    }, []);

    // Leer valores actuales de la URL
    const filters = useMemo((): UrlFilters => {
        const search = searchParams.get('search') || DEFAULT_FILTERS.search;
        const specialization = searchParams.get('specialization') || DEFAULT_FILTERS.specialization;
        const department = searchParams.get('department') || DEFAULT_FILTERS.department;
        const page = parseInt(searchParams.get('page') || String(DEFAULT_FILTERS.page), 10);
        const perPage = parseInt(searchParams.get('perPage') || String(DEFAULT_FILTERS.perPage), 10);

        // Validar que los números sean válidos
        const validPage = isNaN(page) || page < 1 ? DEFAULT_FILTERS.page : page;
        const validPerPage = isNaN(perPage) || perPage < 1 ? DEFAULT_FILTERS.perPage : perPage;

        return {
            search,
            specialization,
            department,
            page: validPage,
            perPage: validPerPage,
        };
    }, [searchParams]);

    // Función centralizada para actualizar filtros en la URL
    const updateFilters = useCallback((updates: Partial<UrlFilters>) => {
        const newParams = new URLSearchParams(searchParams);

        // Actualizar cada parámetro
        Object.entries(updates).forEach(([key, value]) => {
            if (value === '' || value === 'all' || value === DEFAULT_FILTERS[key as keyof UrlFilters]) {
                // Remover parámetros con valores por defecto para URLs más limpias
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }
        });

        // Si cambia cualquier filtro (excepto page), resetear a página 1
        const filtersChanged = Object.keys(updates).some(
            key => key !== 'page' && key !== 'perPage'
        );
        if (filtersChanged && !updates.page) {
            newParams.delete('page');
        }

        setSearchParams(newParams);
        logger.debug('URL filters actualizados', { updates, newParams: newParams.toString() });
    }, [searchParams, setSearchParams]);

    // Funciones individuales para actualizar cada filtro
    const setSearch = useCallback((search: string) => {
        updateFilters({ search });
    }, [updateFilters]);

    const setSpecialization = useCallback((specialization: string) => {
        updateFilters({ specialization });
    }, [updateFilters]);

    const setDepartment = useCallback((department: string) => {
        updateFilters({ department });
    }, [updateFilters]);

    const setPage = useCallback((page: number) => {
        updateFilters({ page });
    }, [updateFilters]);

    const setPerPage = useCallback((perPage: number) => {
        updateFilters({ perPage, page: 1 }); // Reset a página 1 al cambiar items por página
    }, [updateFilters]);

    // Función para resetear todos los filtros
    const resetFilters = useCallback(() => {
        setSearchParams(new URLSearchParams());
        logger.info('Filtros reseteados a valores por defecto');
    }, [setSearchParams]);

    return {
        filters,
        setSearch,
        setSpecialization,
        setDepartment,
        setPage,
        setPerPage,
        updateFilters,
        resetFilters,
    };
};
