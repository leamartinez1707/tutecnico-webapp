import { useTechnicians } from "@/hooks";
import { calculateDistance } from "@/lib/utils";
import { Technicians } from "@/types";
import { useEffect, useState } from "react";
import { logger } from "@/utils/logger";
import { useAuth } from "@/context/AuthContext";
import { getGeoLocation } from "@/api/geo/geoLocationApi";
import { countryInfo } from "@/utils";


const useLocation = () => {
    // Ubicación por defecto: Montevideo centro
    const DEFAULT_LOCATION: [number, number] = [-34.9011, -56.1645];

    const [techniciansWithDistance, setTechniciansWithDistance] = useState<(Technicians & { distance?: number })[]>([]);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [centerMapLocation, setCenterMapLocation] = useState<[number, number]>(DEFAULT_LOCATION);
    const [isLoading, setIsLoading] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isRequestingLocation, setIsRequestingLocation] = useState(false);
    const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

    const { data: techniciansInfo = [] } = useTechnicians();
    const { user } = useAuth();

    // Inicializar ubicación desde el address del usuario autenticado
    useEffect(() => {
        const initializeUserLocation = async () => {
            // Si ya tenemos ubicación o ya la solicitamos, no hacer nada
            if (userLocation || hasRequestedLocation) return;
            
            // Si el usuario no está autenticado o no tiene address, no hacer nada
            if (!user?.address) return;

            try {
                logger.info('Inicializando ubicación desde address del usuario', { address: user.address });
                
                // Extraer departamento del address y limpiar la dirección
                // El formato puede variar: "Calle, Ciudad, Departamento" o "Calle, Ciudad, País"
                const parts = user.address.split(',').map(part => part.trim());
                
                // Buscar qué parte del address corresponde a un departamento válido
                let department: string | undefined;
                let cleanAddressParts: string[] = [];
                
                for (const part of parts) {
                    // Si es "Uruguay" o "uruguay", lo ignoramos
                    if (part.toLowerCase() === 'uruguay') {
                        continue;
                    }
                    
                    // Si es un departamento válido, lo guardamos y lo incluimos en el address
                    const validDept = countryInfo.find(
                        dept => dept.name.toLowerCase() === part.toLowerCase()
                    );
                    if (validDept) {
                        department = validDept.name;
                        logger.debug('Departamento válido encontrado', { department });
                    }
                    
                    cleanAddressParts.push(part);
                }
                
                // Usar el address limpio (sin "Uruguay")
                const cleanAddress = cleanAddressParts.join(', ');
                logger.debug('Address limpio para geocodificación', { cleanAddress, department });
                
                // Geocodificar la dirección
                const geoData = await getGeoLocation(cleanAddress, department);
                
                if (geoData && geoData.length > 0) {
                    const { puntoY, puntoX } = geoData[0];
                    const coordinates: [number, number] = [puntoY, puntoX];
                    
                    logger.info('Ubicación del usuario obtenida desde address', { 
                        coordinates, 
                        address: cleanAddress 
                    });
                    
                    setUserLocation(coordinates);
                    setCenterMapLocation(coordinates);
                    setHasRequestedLocation(true);
                } else {
                    logger.warn('No se pudo geocodificar el address del usuario', { 
                        cleanAddress, 
                        department,
                        geoDataLength: geoData?.length 
                    });
                }
            } catch (error) {
                logger.error('Error al geocodificar address del usuario', error);
            }
        };

        initializeUserLocation();
    }, [user?.address, userLocation, hasRequestedLocation]);

    // Función para solicitar ubicación (puede ser llamada manualmente)
    const requestUserLocation = () => {
        if (!navigator.geolocation) {
            logger.warn('Geolocalización no disponible en este navegador');
            setLocationError('Tu navegador no soporta geolocalización');
            setHasRequestedLocation(true);
            return;
        }

        setIsRequestingLocation(true);
        setLocationError(null);

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                logger.info('Ubicación obtenida exitosamente', {
                    latitude,
                    longitude,
                    accuracy: position.coords.accuracy
                });
                setUserLocation([latitude, longitude]);
                setCenterMapLocation([latitude, longitude]);
                setLocationError(null);
                setIsRequestingLocation(false);
                setHasRequestedLocation(true);
            },
            (error) => {
                let errorMessage = 'No se pudo obtener tu ubicación';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permiso de ubicación denegado. Usando ubicación predeterminada.';
                        logger.warn('Usuario denegó permiso de ubicación');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Ubicación no disponible. Usando ubicación predeterminada.';
                        logger.error('Ubicación no disponible', error);
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Tiempo de espera agotado. Usando ubicación predeterminada.';
                        logger.error('Timeout obteniendo ubicación', error);
                        break;
                    default:
                        logger.error('Error desconocido obteniendo ubicación', error);
                }

                setLocationError(errorMessage);
                setUserLocation(null); // No establecer ubicación si falla
                setIsRequestingLocation(false);
                setHasRequestedLocation(true);
            },
            options
        );
    };

    // NO solicitar ubicación automáticamente - esperar acción del usuario
    // El banner en UserDashboard guiará al usuario a permitir ubicación

    // 2. Calcular distancia solo cuando tenemos userLocation y técnicos nuevos
    useEffect(() => {
        // Si techniciansInfo no es un array válido, inicializar vacío
        if (!Array.isArray(techniciansInfo)) {
            setTechniciansWithDistance([]);
            setIsLoading(false);
            return;
        }

        // Si no hay técnicos aún, mostrar loading
        if (techniciansInfo.length === 0) {
            setIsLoading(false);
            return;
        }

        // Si hay técnicos pero no ubicación, mostrarlos sin distancia
        if (!userLocation) {
            setTechniciansWithDistance(techniciansInfo.map(tech => ({ ...tech, distance: undefined })));
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Calcular distancias cuando tenemos ubicación
        const calculateDistances = async () => {
            const techsWithDistance = techniciansInfo.map((tech) => {
                const distance = calculateDistance(
                    userLocation[0],
                    userLocation[1],
                    tech.latitude,
                    tech.longitude
                );
                return { ...tech, distance };
            });

            // Ordenar por cercanía
            techsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

            setTechniciansWithDistance(techsWithDistance);
            setIsLoading(false);
        };

        calculateDistances();
    }, [techniciansInfo, userLocation]);

    // Función para establecer ubicación manualmente desde una dirección
    const setManualLocation = (coords: [number, number], address: string) => {
        logger.info('Ubicación manual establecida', { coords, address });
        setUserLocation(coords);
        setCenterMapLocation(coords);
        setLocationError(null);
        setHasRequestedLocation(true);
    };

    return {
        userLocation,
        setUserLocation,
        centerMapLocation,
        setCenterMapLocation,
        techniciansWithDistance,
        isLoading,
        locationError,
        isRequestingLocation,
        hasRequestedLocation,
        requestUserLocation,
        setManualLocation
    };
}

export default useLocation