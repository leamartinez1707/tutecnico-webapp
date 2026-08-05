import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { logger } from "../../utils/logger";

const SearchDirection = () => {
    const [direccion, setDireccion] = useState<string>("");
    const [coordenadas, setCoordenadas] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // Aplicar debounce para evitar múltiples peticiones
    const debouncedDireccion = useDebounce(direccion, 500);

    const buscarDireccion = async (searchTerm: string) => {
        if (!searchTerm) {
            setCoordenadas(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const respuesta = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`
            );
            const data = await respuesta.json();
            if (data.length > 0) {
                setCoordenadas([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
            } else {
                setError("Dirección no encontrada");
            }
        } catch (err) {
            logger.error('Error al buscar dirección', err);
            setError("Error al buscar la dirección");
        } finally {
            setLoading(false);
        }
    };

    // Buscar automáticamente cuando cambie el valor debounced
    useEffect(() => {
        buscarDireccion(debouncedDireccion);
    }, [debouncedDireccion]);

    return (
        <div className="flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-md">
            <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ingresa tu dirección"
                className="border p-2 w-full rounded-md"
            />
            {loading && <p className="text-sm text-gray-500">Buscando...</p>}
            {coordenadas && <p>📍 Coordenadas: {coordenadas[0]}, {coordenadas[1]}</p>}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default SearchDirection;
