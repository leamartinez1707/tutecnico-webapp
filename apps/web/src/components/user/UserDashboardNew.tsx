import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import FormBooking from "@/components/bookings/FormBooking"
import ModalUi from "@/components/modal/ModalUi"
import UserMap from "@/components/user/dashboard/UserMap"
import LocationBanner from "@/components/user/LocationBanner"
import { useBookingHandler } from "@/hooks/useBookingHandler"
import useTechPagination from "@/hooks/useTechPagination"
import { countryInfo } from "@/utils"
import {
    Search, MapPin, SlidersHorizontal, Navigation,
    List, Map as MapIconLucide, BadgeCheck, ChevronRight,
    RefreshCw, Star, X, FilterX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserAvatar from "@/components/ui/UserAvatar"
import useLocation from "@/hooks/geo/useLocation"
import { useTechnicians } from "@/hooks"
import { logger } from "@/utils/logger"
import SectionErrorBoundary from "@/components/Error/SectionErrorBoundary"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { capitalizeFirstLetter } from "@/utils"
import type { Technicians } from "@/types"
import { useAuth } from "@/context/AuthContext"
import { useSpecializations } from "@/hooks/queries/useSpecializations"
import PaginationUi from "@/components/pagination/PaginationUi"
import "leaflet/dist/leaflet.css"

/**
 * Extrae el departamento del address del usuario
 * El formato esperado es: "Calle, Localidad, Departamento"
 */
const extractDepartmentFromAddress = (address: string | undefined): string | null => {
    if (!address) return null;

    // El address viene en formato: "Calle, Localidad, Departamento"
    const parts = address.split(',').map(part => part.trim());

    // El departamento es la última parte
    const department = parts[parts.length - 1];

    // Verificar que el departamento existe en countryInfo
    const validDepartment = countryInfo.find(
        dept => dept.name.toLowerCase() === department.toLowerCase()
    );

    return validDepartment ? validDepartment.name : null;
};

// Componente principal
export default function UserDashboard() {
    const { user } = useAuth();

    // URL Filters - fuente de verdad
    const { filters, setSearch, setSpecialization, setDepartment, setPage, resetFilters } = useUrlFilters();
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<"split" | "list" | "map">("split");

    // Inicializar filtro de departamento basado en la ubicación del usuario
    useEffect(() => {
        // Solo ejecutar si:
        // 1. El usuario está autenticado y tiene address
        // 2. El filtro actual es "all" (no ha sido modificado por el usuario)
        if (user?.address && filters.department === 'all') {
            const userDepartment = extractDepartmentFromAddress(user.address);
            if (userDepartment) {
                logger.info('Inicializando filtro de departamento desde perfil del usuario', {
                    userDepartment,
                    userAddress: user.address
                });
                setDepartment(userDepartment);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.address]); // Intencionalmente solo ejecutar cuando cambia el address del usuario

    // Contar filtros activos
    const activeFiltersCount = [
        filters.search !== '',
        filters.specialization !== 'all',
        filters.department !== 'all'
    ].filter(Boolean).length;

    const hasActiveFilters = activeFiltersCount > 0;

    const { userLocation, centerMapLocation, setCenterMapLocation, isLoading, techniciansWithDistance, locationError, isRequestingLocation, hasRequestedLocation, requestUserLocation, setManualLocation } = useLocation();
    const { data: specializations } = useSpecializations();
    const { refetch: refetchTechnicians, isError: techniciansError, isLoading: techniciansLoading } = useTechnicians();
    const {
        setBookingData,
        selectedTechnician,
        setSelectedTechnician,
        addBookingModal,
        setAddBookingModal,
        handleAddBooking,
    } = useBookingHandler();

    // Función para refrescar manualmente la lista de técnicos
    const handleManualRefresh = async () => {
        if (isRefreshing) return;

        setIsRefreshing(true);
        logger.info('Actualización manual de técnicos solicitada');

        try {
            await refetchTechnicians();
            logger.info('Lista de técnicos actualizada manualmente');
        } catch (error) {
            logger.error('Error al actualizar técnicos manualmente', error);
        } finally {
            setTimeout(() => setIsRefreshing(false), 1000);
        }
    };

    // Filtrar técnicos según los criterios de búsqueda
    const removeAccents = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const filteredTechnicians = techniciansWithDistance.filter((tech) => {
        const normalizedName = removeAccents(`${tech.firstName} ${tech.lastName}`);
        const normalizedSpecialization = removeAccents(tech.specialization || "");
        const normalizedServices = tech.services.map(removeAccents);
        const normalizedAddress = removeAccents(tech.address || "");

        // Palabras clave normalizadas del input de búsqueda
        const searchWords = removeAccents(filters.search).split(/\s+/).filter(Boolean);

        // Coincidencia con nombre o servicios
        const matchesSearch = !filters.search || searchWords.every((word) =>
            normalizedName.includes(word) ||
            normalizedServices.some(service => service.includes(word))
        );

        // Coincidencia con filtro de especialización
        const matchesSpecialization =
            filters.specialization === "all" ||
            normalizedSpecialization === removeAccents(filters.specialization);

        // Coincidencia con filtro de departamento (buscar en address)
        const matchesDepartment =
            filters.department === "all" ||
            normalizedAddress.includes(removeAccents(filters.department));

        return matchesSearch && matchesSpecialization && matchesDepartment;
    });

    const { totalPages, paginatedTechnicians } = useTechPagination({
        filteredTechnicians,
        itemsPerPage: filters.perPage,
        currentPage: filters.page
    });

    // Referencia para los marcadores del mapa
    const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});

    // Obtener lista única de departamentos ordenados
    const departments = countryInfo
        .map(dept => dept.name)
        .sort((a, b) => a.localeCompare(b));

    // Categorías de especialización
    const categories = ["Todos", ...(specializations?.items.map(s => s.name).sort() || [])];

    return (
        <div className="min-h-screen bg-black">
            {/* Header Section */}
            <div className="bg-linear-to-b from-zinc-900 to-black border-b border-zinc-800 pt-24 pb-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl text-white mb-4 font-bold">
                            Busca el técnico más cercano
                        </h1>
                        <p className="text-xl text-zinc-400">
                            Técnicos certificados y confiables en tu área para resolver tu problema cuanto antes
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-3 flex flex-col md:flex-row gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <Input
                                    value={filters.search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Buscar por servicio, marca o problema..."
                                    className="pl-12 bg-zinc-800/50 border-zinc-700 h-12 text-white placeholder:text-zinc-500"
                                />
                            </div>
                            <Button
                                className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8"
                                onClick={handleManualRefresh}
                                disabled={isRefreshing}
                            >
                                <Search className="mr-2 text-white h-5 w-5" />
                                {isRefreshing ? 'Buscando...' : 'Buscar'}
                            </Button>
                        </div>
                    </motion.div>

                    {/* Category Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide"
                    >
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all ${showFilters
                                ? "bg-blue-600 text-white"
                                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                }`}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            {showFilters ? 'Cerrar filtros' : 'Filtros'}
                            {!showFilters && activeFiltersCount > 0 && (
                                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                        {categories.slice(0, 8).map((category) => (
                            <button
                                key={category}
                                onClick={() => setSpecialization(category === "Todos" ? "all" : category)}
                                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${(filters.specialization === "all" && category === "Todos") || filters.specialization === category
                                    ? "bg-blue-600 text-white"
                                    : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                    }`}
                            >
                                {capitalizeFirstLetter(category)}
                            </button>
                        ))}
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4"
                    >
                        <div className="flex items-center gap-6 text-sm text-zinc-400 flex-wrap">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-blue-400" />
                                <span>{filteredTechnicians.length} técnicos disponibles</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="h-4 w-4 text-emerald-400" />
                                <span>Todos verificados</span>
                            </div>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-700/50 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded transition-colors ${viewMode === "list"
                                    ? "bg-blue-600 text-white"
                                    : "text-zinc-400 hover:text-white"
                                    }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("split")}
                                className={`p-2 rounded transition-colors ${viewMode === "split"
                                    ? "bg-blue-600 text-white"
                                    : "text-zinc-400 hover:text-white"
                                    }`}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("map")}
                                className={`p-2 rounded transition-colors ${viewMode === "map"
                                    ? "bg-blue-600 text-white"
                                    : "text-zinc-400 hover:text-white"
                                    }`}
                            >
                                <MapIconLucide className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Filtros Activos */}
                    {hasActiveFilters && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mt-4 flex-wrap"
                        >
                            <span className="text-sm text-zinc-400">Filtros activos:</span>

                            {filters.search && (
                                <div className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-full px-3 py-1.5">
                                    <Search className="h-3 w-3 text-zinc-400" />
                                    <span className="text-zinc-300 text-sm">"{filters.search}"</span>
                                    <button
                                        onClick={() => setSearch('')}
                                        className="ml-1 hover:bg-zinc-700 rounded-full p-0.5 transition-colors"
                                        title="Quitar búsqueda"
                                    >
                                        <X className="h-3 w-3 text-zinc-400 hover:text-white" />
                                    </button>
                                </div>
                            )}

                            {filters.specialization !== 'all' && (
                                <div className="flex items-center gap-2 bg-blue-900/20 border border-blue-700/50 rounded-full px-3 py-1.5">
                                    <BadgeCheck className="h-3 w-3 text-blue-400" />
                                    <span className="text-blue-300 text-sm">{capitalizeFirstLetter(filters.specialization)}</span>
                                    <button
                                        onClick={() => setSpecialization('all')}
                                        className="ml-1 hover:bg-blue-700/30 rounded-full p-0.5 transition-colors"
                                        title="Quitar especialización"
                                    >
                                        <X className="h-3 w-3 text-blue-400 hover:text-blue-300" />
                                    </button>
                                </div>
                            )}

                            {filters.department !== 'all' && (
                                <div className="flex items-center gap-2 bg-emerald-900/20 border border-emerald-700/50 rounded-full px-3 py-1.5">
                                    <MapPin className="h-3 w-3 text-emerald-400" />
                                    <span className="text-emerald-300 text-sm">{filters.department}</span>
                                    <button
                                        onClick={() => setDepartment('all')}
                                        className="ml-1 hover:bg-emerald-700/30 rounded-full p-0.5 transition-colors"
                                        title="Quitar departamento"
                                    >
                                        <X className="h-3 w-3 text-emerald-400 hover:text-emerald-300" />
                                    </button>
                                </div>
                            )}

                            {/* Botón limpiar todos */}
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-2 bg-red-900/20 border border-red-700/50 rounded-full px-3 py-1.5 hover:bg-red-900/30 transition-colors"
                                title="Limpiar todos los filtros"
                            >
                                <FilterX className="h-3 w-3 text-red-400" />
                                <span className="text-red-300 text-sm">Limpiar todo</span>
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-b border-zinc-800 overflow-hidden bg-zinc-900/50"
                    >
                        <div className="container mx-auto px-4 py-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-zinc-400 mb-2 block">Especialización</label>
                                    <select
                                        value={filters.specialization}
                                        onChange={(e) => setSpecialization(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                                    >
                                        <option value="all">Todas</option>
                                        {specializations?.items.sort((a, b) => a.name.localeCompare(b.name)).map((spec) => (
                                            <option key={spec.id} value={spec.name}>
                                                {capitalizeFirstLetter(spec.name)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm text-zinc-400 mb-2 block">Departamento</label>
                                    <select
                                        value={filters.department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                                    >
                                        <option value="all">Todos</option>
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Location Messages */}
            {locationError && (
                <div className="container mx-auto px-4 mt-4">
                    <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4 flex items-start gap-3">
                        <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-500">{locationError}</p>
                            <p className="text-xs text-yellow-600 mt-1">Mostrando técnicos desde Montevideo centro.</p>
                            <button
                                onClick={requestUserLocation}
                                className="mt-2 text-xs font-medium text-yellow-500 hover:text-yellow-400 underline"
                            >
                                Intentar nuevamente
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner de ubicación - solo mostrar si el usuario NO tiene dirección */}
            {!user?.address && !hasRequestedLocation && !isRequestingLocation && !locationError && (
                <div className="container mx-auto px-4 mt-4">
                    <LocationBanner
                        onLocationSelected={setManualLocation}
                        onUseGeolocation={requestUserLocation}
                    />
                </div>
            )}

            {isRequestingLocation && !locationError && (
                <div className="container mx-auto px-4 mt-4">
                    <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4 flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-sm text-blue-400">Solicitando tu ubicación...</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className={`grid ${viewMode === "split" ? "lg:grid-cols-5" : "grid-cols-1"} gap-6`}>
                    {/* Map */}
                    {viewMode !== "list" && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${viewMode === "split" ? "lg:col-span-3" : ""} bg-zinc-900 border border-zinc-700/50 rounded-2xl overflow-hidden relative h-[calc(100vh-450px)] min-h-[600px]`}
                        >
                            {isLoading ? (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800/30">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-zinc-700 rounded-full mx-auto mb-4 animate-pulse"></div>
                                        <p className="text-zinc-400">Cargando mapa...</p>
                                    </div>
                                </div>
                            ) : (
                                <SectionErrorBoundary
                                    sectionName="Mapa"
                                    fallbackMessage="No pudimos cargar el mapa. Por favor, recarga la página."
                                >
                                    <UserMap
                                        userLocation={userLocation}
                                        filteredTechnicians={filteredTechnicians}
                                        setSelectedTechnician={setSelectedTechnician}
                                        setAddBookingModal={setAddBookingModal}
                                        centerMapLocation={centerMapLocation}
                                        setCenterMapLocation={setCenterMapLocation}
                                        markerRefs={markerRefs}
                                    />
                                </SectionErrorBoundary>
                            )}

                            {/* Map Controls */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <Button
                                    size="icon"
                                    onClick={requestUserLocation}
                                    className="bg-white hover:bg-zinc-100 text-zinc-900 shadow-lg"
                                    title="Mi ubicación"
                                >
                                    <Navigation className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    onClick={handleManualRefresh}
                                    disabled={isRefreshing}
                                    className="bg-white hover:bg-zinc-100 text-zinc-900 shadow-lg"
                                    title="Actualizar"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>

                            {/* Map Legend */}
                            <div className="absolute bottom-4 left-4 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 rounded-lg p-3">
                                <div className="text-sm text-zinc-400 mb-2 font-medium">Leyenda</div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full" />
                                        <span className="text-zinc-300">Técnico disponible</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-600 rounded-full" />
                                        <span className="text-zinc-300">Tu ubicación</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Technicians List */}
                    {viewMode !== "map" && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${viewMode === "split" ? "lg:col-span-2" : ""} h-[calc(100vh-450px)] min-h-[600px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent`}
                        >
                            {isLoading || techniciansLoading ? (
                                <>
                                    {[...Array(5)].map((_, index) => (
                                        <TechnicianSkeleton key={index} />
                                    ))}
                                </>
                            ) : techniciansError ? (
                                <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-8 text-center">
                                    <div className="text-red-500 mb-4">
                                        <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-red-400 mb-2">Error al cargar técnicos</h3>
                                    <p className="text-red-500 mb-4 text-sm">No se pudieron cargar los datos.</p>
                                    <button
                                        onClick={handleManualRefresh}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            ) : paginatedTechnicians.length === 0 ? (
                                <div className="text-center py-20 text-zinc-400">
                                    <MapIconLucide className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                                    <p className="text-lg">No se encontraron técnicos</p>
                                    <p className="text-sm mt-2">Intenta ajustar los filtros de búsqueda</p>
                                </div>
                            ) : (
                                paginatedTechnicians.map((tech, index) => (
                                    <TechnicianCard
                                        key={tech.id}
                                        tech={tech}
                                        index={index}
                                        onClick={() => {
                                            const marker = markerRefs.current[tech.id];
                                            if (marker) {
                                                marker.openPopup();
                                            }
                                            setSelectedTechnician(tech);
                                            setCenterMapLocation([tech.latitude, tech.longitude]);
                                        }}
                                        onBookingClick={() => {
                                            setSelectedTechnician(tech);
                                            setAddBookingModal(true);
                                        }}
                                    />
                                ))
                            )}

                            {/* Paginación */}
                            {!isLoading && !techniciansError && paginatedTechnicians.length > 0 && (
                                <div className="mt-6">
                                    <PaginationUi
                                        currentPage={filters.page}
                                        setCurrentPage={setPage}
                                        totalPages={totalPages}
                                        onPageChange={setPage}
                                    />
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Modal de reserva */}
            <ModalUi
                open={addBookingModal}
                setOpen={setAddBookingModal}
                firstName={selectedTechnician?.firstName}
                lastName={selectedTechnician?.lastName}
            >
                <FormBooking
                    handleAddBooking={handleAddBooking}
                    setBookingData={setBookingData}
                    setAddBookingModal={setAddBookingModal}
                />
            </ModalUi>
        </div>
    );
}

// Componente de Skeleton para técnicos
const TechnicianSkeleton = () => (
    <div className="bg-zinc-900/50 border border-zinc-700/50 rounded-xl p-4 animate-pulse">
        <div className="flex gap-4">
            <div className="w-16 h-16 bg-zinc-700 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
                <div className="h-5 bg-zinc-700 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                <div className="h-4 bg-zinc-700 rounded w-20"></div>
            </div>
        </div>
    </div>
);

// Componente de tarjeta de técnico
interface TechnicianCardProps {
    tech: Technicians & { distance?: number };
    index: number;
    onClick: () => void;
    onBookingClick: () => void;
}

const TechnicianCard = ({ tech, index, onClick, onBookingClick }: TechnicianCardProps) => {
    const navigate = useNavigate();

    const { isAuthenticated } = useAuth();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
            className="bg-zinc-900/50 border border-zinc-700/50 rounded-xl p-4 hover:bg-zinc-800/50 hover:border-blue-600/50 transition-all cursor-pointer group"
        >
            <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden ring-2 ring-zinc-700 group-hover:ring-blue-600 transition-all">
                        <UserAvatar
                            photoUrl={tech.profilePhotoUrl}
                            size="lg"
                            className="w-full h-full"
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                        <BadgeCheck className="h-3 w-3 text-white" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                        <h3 className="text-white group-hover:text-blue-400 transition-colors truncate font-medium">
                            {tech.firstName} {tech.lastName}
                        </h3>
                        <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    </div>

                    <p className="text-blue-400 text-sm mb-2 capitalize">{tech.specialization}</p>
                    <div>
                        {tech.services.slice(0, 3).map((service, idx) => (
                            <span
                                key={idx}
                                className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded mr-2 mb-2"
                            >
                                {capitalizeFirstLetter(service)}
                            </span>))}
                        {tech.services.length > 3 && (
                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded mr-2 mb-2">
                                +{tech.services.length - 3}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{tech.address?.split(',')[0] || 'Sin ubicación'}</span>
                        </div>
                        {tech.distance && (
                            <div className="flex items-center gap-1">
                                <Navigation className="h-3 w-3" />
                                <span>{tech.distance ? tech.distance.toString().substring(0, 4) + ' km' : 'No hay datos'}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-white text-sm">{Number(tech.averageRating).toFixed(1)}</span>
                                {/* <span className="text-zinc-500 text-xs">({techReviews.length})</span> */}
                            </div>
                        </div>
                        <div className="space-x-2">
                            <Button
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isAuthenticated) {
                                        localStorage.setItem('pendingBookingTechnician', tech.username);
                                        navigate('/login');
                                        return;
                                    }
                                    onBookingClick();
                                }}
                                className="bg-blue-600 text-white hover:bg-blue-700 text-xs h-7"
                            >
                                Reservar
                            </Button>
                            <Button
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/tecnico/detalle/${tech.username}`)
                                }}
                                className="bg-yellow-600 text-white hover:bg-yellow-700 text-xs h-7"
                            >
                                Ver perfil
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div >
    );
};
