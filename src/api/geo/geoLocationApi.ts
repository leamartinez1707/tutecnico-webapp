import { logger } from "@/utils/logger";

// Ejemplo direccion https://direcciones.ide.uy/api/v0/geocode/BusquedaDireccion?calle=Cayetano%20rivas%204007&departamento=montevideo
export const getGeoLocation = async (address: string, department?: string) => {
    try {
        const formatedAddress = encodeURIComponent(address);
        let url = `https://direcciones.ide.uy/api/v0/geocode/BusquedaDireccion?calle=${formatedAddress}`;
        
        // Agregar departamento si está presente para mayor precisión
        if (department) {
            const formatedDepartment = encodeURIComponent(department.toLowerCase());
            url += `&departamento=${formatedDepartment}`;
        }
        
        logger.debug('Llamando API de geocodificación', { url, address, department });
        
        const response = await fetch(url);
        if (!response.ok) {
            logger.error('Error en respuesta de API de geocodificación', { 
                status: response.status, 
                statusText: response.statusText,
                url 
            });
            throw new Error('Error al obtener la ubicación geográfica');
        }
        const data = await response.json();
        logger.debug('Respuesta de API de geocodificación', { 
            resultCount: data?.length || 0,
            hasResults: data && data.length > 0 
        });
        return data;
    } catch (error) {
        logger.error('Error al obtener la ubicación geográfica', error);
        throw error;
    }
}
