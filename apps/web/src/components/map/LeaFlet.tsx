import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useUsers } from "@/context/UsersContext";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { enqueueSnackbar } from "notistack";
import { getGeoLocation } from "@/api/geo/geoLocationApi";
import { logger } from "@/utils/logger";

// Icono personalizado
const icon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
});
const iconRed = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9131/9131546.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
});

// Componente para mover el mapa cuando cambian las coordenadas
const ChangeView: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    map.setView(center, 15); // Mueve el mapa a la nueva ubicación
    return null;
};

type LeafletMapProps = {
    userDirection?: string;
};

const LeafletMap = ({ userDirection }: LeafletMapProps) => {
    const [ubicacionActual, setUbicacionActual] = useState<[number, number] | null>(null);
    const [ubicacionBuscada, setUbicacionBuscada] = useState<[number, number] | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { updateLocationData } = useUsers()
    const { user } = useAuth()

    const handleConfirmLocation = async () => {
        if (!ubicacionBuscada || !userDirection) return;
        const locationData = {
            latitude: ubicacionBuscada[0],
            longitude: ubicacionBuscada[1],
            address: userDirection,
        };
        if (user) {
            try {
                await updateLocationData(user.id, locationData);
                enqueueSnackbar("Ubicación actualizada correctamente", { variant: "success" });
            } catch (error) {
                logger.error('Error al actualizar ubicación', error);
                enqueueSnackbar("Error al actualizar la ubicación", { variant: "error" });
            }
        }
        setUbicacionActual(ubicacionBuscada);
        setMapCenter(ubicacionBuscada);
        setShowConfirmation(false);
        setTimeout(() => {
            setUbicacionBuscada(null);
        }, 300);
    };


    const handleCancelLocation = () => {
        setUbicacionBuscada(null);
        setShowConfirmation(false);
    }

    useEffect(() => {
        // Cuando la dirección de perfil cambia, actualiza el mapa y el input
        if (!userDirection) return;
        
        const obtenerUbicacionInicial = async () => {
            try {
                // Buscar la dirección completa sin especificar departamento
                // La API de IDE Uruguay puede manejar direcciones completas
                const respuestaGeo = await getGeoLocation(userDirection);
                
                if (!respuestaGeo[0]) {
                    setError("Dirección no encontrada");
                    logger.error('Dirección no encontrada', { direccion: userDirection });
                } else {
                    const coords: [number, number] = [respuestaGeo[0].puntoY, respuestaGeo[0].puntoX];
                    setUbicacionActual(coords);
                    setMapCenter(coords);
                    setError(null);
                    logger.debug('Ubicación encontrada', { direccion: userDirection, coords });
                }
            } catch (error) {
                setError("Error al buscar la dirección");
                logger.error('Error al obtener ubicación', { direccion: userDirection, error });
            }
        };
        
        obtenerUbicacionInicial();
    }, [userDirection]);

    // // Busca la dirección solo cuando el usuario confirma
    // const buscarDireccion = async () => {
    //     if (!direccion) return;
    //     try {
    //         const respuestaGeo = await getGeoLocation(direccion, "Montevideo");
    //         if (!respuestaGeo[0]) {
    //             setError("Dirección no encontrada");
    //             setUbicacionBuscada(null);
    //         } else {
    //             const coords: [number, number] = [respuestaGeo[0].puntoY, respuestaGeo[0].puntoX];
    //             setUbicacionBuscada(coords);
    //             setError(null);
    //             setShowConfirmation(true);
    //         }
    //     } catch {
    //         enqueueSnackbar("Error al buscar la dirección", { variant: "error" });
    //         setError("Error al buscar la dirección");
    //     }
    // };

    return (
        <div className="flex flex-col items-center w-full z-0">
            {mapCenter ? (
                <MapContainer
                    center={mapCenter}
                    zoom={13}
                    className="w-full h-96 mt-4 z-10 relative"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <ChangeView center={mapCenter} />
                    {ubicacionActual && <Marker position={ubicacionActual} icon={icon}><Popup>Tu ubicación</Popup></Marker>}
                    {ubicacionBuscada && <Marker position={ubicacionBuscada} icon={iconRed}><Popup>Dirección buscada</Popup></Marker>}
                </MapContainer>
            ) : <p>Cargando mapa..</p>}
            {error && <p className="text-red-500">{error}</p>}
            {showConfirmation && (
                <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                    <DialogContent className="bg-white rounded-lg p-6 max-w-md mx-auto">
                        <DialogHeader>
                            <DialogTitle>Desea confirmar la dirección?</DialogTitle>
                            <DialogDescription className="text-md">
                                {userDirection}
                            </DialogDescription>
                        </DialogHeader>
                        <Button
                            variant="outline"
                            className="bg-green-500 hover:bg-green-700 hover:text-white text-white px-4 py-2 rounded hover:cursor-pointer"
                            onClick={handleConfirmLocation}
                        >
                            Confirmar
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-red-500 hover:bg-red-700 hover:text-white text-white px-4 py-2 rounded hover:cursor-pointer"
                            onClick={handleCancelLocation}
                        >
                            Cancelar
                        </Button>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default LeafletMap;
