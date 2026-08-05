import { Dispatch, useEffect, useState, memo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from "react-leaflet";
import { Technicians } from '@/types';
import TechnicianModal from '../../technician/TechnicianModal';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Icono para la ubicación del usuario
const userLocationIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9131/9131546.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
});

// Función para crear icono personalizado de técnico
function createCustomIcon(tech: Technicians & { distance?: number }, idx: number): L.DivIcon {
    const imgSrc = tech.profilePhotoUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzM3NDE0OSIvPjxwYXRoIGQ9Ik0xMiAxMkM5LjIzODU4IDEyIDcgOS43NjE0MiA3IDdDNyA0LjIzODU4IDkuMjM4NTggMiAxMiAyQzE0Ljc2MTQgMiAxNyA0LjIzODU4IDE3IDdDMTcgOS43NjE0MiAxNC43NjE0IDEyIDEyIDEyWiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yMCAyMEMyMCAxNi42ODYzIDE2LjQxODMgMTQgMTIgMTRDNy41ODE3MiAxNCA0IDE2LjY4NjMgNCAyMEg0IiBmaWxsPSIjRkZGIi8+PC9zdmc+';
    
    return L.divIcon({
        className: "custom-tech-icon",
        html: `
            <div class='relative flex items-center justify-center'>
                <span class="pulse"></span>
                <div class="rounded-full border-2 border-blue-500 bg-white shadow-lg w-12 h-12 flex items-center justify-center overflow-hidden relative">
                    <img src='${imgSrc}' alt='${tech.firstName}' class='w-10 h-10 object-cover rounded-full' onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iIzM3NDE0OSIvPjxwYXRoIGQ9Ik0xMiAxMkM5LjIzODU4IDEyIDcgOS43NjE0MiA3IDdDNyA0LjIzODU4IDkuMjM4NTggMiAxMiAyQzE0Ljc2MTQgMiAxNyA0LjIzODU4IDE3IDdDMTcgOS43NjE0MiAxNC43NjE0IDEyIDEyIDEyWiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yMCAyMEMyMCAxNi42ODYzIDE2LjQxODMgMTQgMTIgMTRDNy41ODE3MiAxNCA0IDE2LjY4NjMgNCAyMEg0IiBmaWxsPSIjRkZGIi8+PC9zdmc+'"/>
                    <span class='absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold rounded-full px-1 py-0.5' style='transform: translate(40%,-40%);'>${idx + 1}</span>
                </div>
            </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
    });
}

// Componente ClusterLayer: integración manual con leaflet.markercluster
interface ClusterLayerProps {
    technicians: (Technicians & { distance?: number })[];
    onTechnicianClick: (tech: Technicians & { distance?: number }) => void;
    markerRefs: React.RefObject<{ [key: string]: L.Marker | null }>;
}

const ClusterLayer = memo(({ technicians, onTechnicianClick, markerRefs }: ClusterLayerProps) => {
    const map = useMap();

    useEffect(() => {
        // Crear el grupo de clusters
        const markerClusterGroup = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 40,
            spiderfyOnMaxZoom: true,
            disableClusteringAtZoom: 17,
            iconCreateFunction: (cluster) => {
                const count = cluster.getChildCount();
                return L.divIcon({
                    html: `<div class="cluster-marker"><span>${count}</span></div>`,
                    className: 'custom-cluster-icon',
                    iconSize: [40, 40],
                });
            },
        });

        // Agregar marcadores al grupo de clusters
        technicians.forEach((tech, idx) => {
            const marker = L.marker([tech.latitude, tech.longitude], {
                icon: createCustomIcon(tech, idx),
                title: `${tech.firstName} ${tech.lastName} - ${tech.specialization}${tech.distance ? ` (${tech.distance.toString().substring(0, 4)} km)` : ''}`,
            });

            // Evento click en el marcador
            marker.on('click', () => {
                onTechnicianClick(tech);
            });

            // Guardar referencia del marcador
            if (markerRefs.current) {
                markerRefs.current[tech.id] = marker;
            }

            markerClusterGroup.addLayer(marker);
        });

        // Añadir el grupo al mapa
        map.addLayer(markerClusterGroup);

        // Cleanup: remover el grupo cuando el componente se desmonte o technicians cambie
        return () => {
            map.removeLayer(markerClusterGroup);
        };
    }, [map, technicians, onTechnicianClick, markerRefs]);

    return null;
});

ClusterLayer.displayName = 'ClusterLayer';

// Componente para centrar el mapa en la ubicación especificada
const SetViewOnLocation = memo(({ location }: { location: [number, number] }) => {
    const map = useMap();
    
    useEffect(() => {
        map.setView(location, 13);
    }, [location, map]);
    
    return null;
});

SetViewOnLocation.displayName = 'SetViewOnLocation';

// Props del componente UserMap
type UserMapProps = {
    centerMapLocation: [number, number];
    userLocation: [number, number] | null;
    filteredTechnicians: (Technicians & { distance?: number })[];
    setSelectedTechnician: Dispatch<React.SetStateAction<Partial<Technicians> | null>>;
    setAddBookingModal: Dispatch<React.SetStateAction<boolean>>;
    setCenterMapLocation: Dispatch<React.SetStateAction<[number, number]>>;
    markerRefs: React.RefObject<{ [key: string]: L.Marker | null }>;
};

const UserMap = memo(({
    centerMapLocation,
    userLocation,
    filteredTechnicians,
    setSelectedTechnician,
    setAddBookingModal,
    setCenterMapLocation,
    markerRefs
}: UserMapProps) => {
    const [selectedTechForModal, setSelectedTechForModal] = useState<(Technicians & { distance?: number }) | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handler para click en técnico
    const handleTechnicianClick = (tech: Technicians & { distance?: number }) => {
        setSelectedTechnician(tech);
        setSelectedTechForModal(tech);
        setIsModalOpen(true);
        setCenterMapLocation([tech.latitude, tech.longitude]);
    };

    return (
        <MapContainer
            center={centerMapLocation}
            zoom={15}
            className="w-full h-full z-0 relative"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="topright" />

            {/* Centrar el mapa en la ubicación especificada */}
            <SetViewOnLocation location={centerMapLocation} />

            {/* Marcador para la ubicación del usuario */}
            {userLocation && (
                <Marker
                    position={userLocation}
                    icon={userLocationIcon}
                    title="Tu ubicación actual"
                />
            )}

            {/* Capa de clusters con técnicos */}
            <ClusterLayer
                technicians={filteredTechnicians}
                onTechnicianClick={handleTechnicianClick}
                markerRefs={markerRefs}
            />

            {/* Estilos para iconos personalizados y animación pulse */}
            <style>{`
                .custom-tech-icon .pulse {
                    position: absolute;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: rgba(59,130,246,0.3);
                    animation: pulse 1.5s infinite;
                    z-index: 0;
                }
                
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.7; }
                    70% { transform: scale(1.2); opacity: 0; }
                    100% { transform: scale(0.95); opacity: 0; }
                }

                .custom-cluster-icon .cluster-marker {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                    border: 2px solid white;
                }
            `}</style>

            {/* Modal para mostrar detalles del técnico */}
            <TechnicianModal
                tech={selectedTechForModal}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTechForModal(null);
                }}
                setAddBookingModal={setAddBookingModal}
            />
        </MapContainer>
    );
});

UserMap.displayName = 'UserMap';

export default UserMap;