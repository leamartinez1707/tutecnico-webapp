import { useState } from "react";
import { getGeoLocation } from "@/api/geo/geoLocationApi";
import { logger } from "@/utils/logger";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "@/context/AuthContext";

type LocationBannerProps = {
    onLocationSelected: (coords: [number, number], address: string) => void;
    onUseGeolocation: () => void;
};

const LocationBanner = ({ onLocationSelected, onUseGeolocation }: LocationBannerProps) => {

    const { user } = useAuth();
    const [address, setAddress] = useState(user?.address || "");
    const [isSearching, setIsSearching] = useState(false);
    const [showInput, setShowInput] = useState(false);

    const handleSearchAddress = async () => {
        if (!address.trim()) {
            enqueueSnackbar("Por favor ingresa una dirección", { variant: "warning" });
            return;
        }

        setIsSearching(true);
        try {
            const results = await getGeoLocation(address, "Uruguay");

            if (!results || results.length === 0) {
                enqueueSnackbar("No se encontró la dirección. Intenta con más detalles (ej: 18 de Julio 1234, Montevideo)", { variant: "error" });
                logger.warn("Dirección no encontrada", { address });
                return;
            }

            const coords: [number, number] = [results[0].puntoY, results[0].puntoX];
            const fullAddress = results[0].direccion || address;

            onLocationSelected(coords, fullAddress);
            enqueueSnackbar("¡Ubicación establecida correctamente!", { variant: "success" });
            logger.info("Ubicación seleccionada manualmente", { coords, address: fullAddress });
        } catch (error) {
            logger.error("Error al buscar dirección", error);
            enqueueSnackbar("Error al buscar la dirección", { variant: "error" });
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearchAddress();
        }
    };
    return (
        <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
            <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm mb-1">Encuentra técnicos cerca de ti</h3>
                    <p className="text-blue-100 text-xs mb-3">
                        Ingresa tu dirección para ver los técnicos más cercanos y sus distancias
                    </p>

                    {!showInput ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={() => setShowInput(true)}
                                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
                            >
                                📍 Ingresar dirección
                            </button>
                            <button
                                onClick={onUseGeolocation}
                                className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
                            >
                                📡 Usar geolocalización
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ej: 18 de Julio 1234, Montevideo"
                                    className="flex-1 text-white font-semibold px-3 py-2 rounded-md text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white ring-gray-300 ring-1 min-w-0"
                                    disabled={isSearching}
                                />
                                <button
                                    onClick={handleSearchAddress}
                                    disabled={isSearching}
                                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {isSearching ? "Buscando..." : "Buscar"}
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    setShowInput(false);
                                    setAddress("");
                                }}
                                className="text-blue-100 hover:text-white text-xs underline"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationBanner;
