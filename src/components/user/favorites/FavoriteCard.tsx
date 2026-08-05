import { motion } from "motion/react";
import { Star, MapPin, Heart, BadgeCheck, ChevronRight, BookIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserFavorites } from "@/types";
import { useNavigate } from "react-router-dom";
import UserAvatar from "@/components/ui/UserAvatar";
import { useBookingHandler } from "@/hooks/useBookingHandler";
import ModalUi from "@/components/modal/ModalUi";
import FormBooking from "@/components/bookings/FormBooking";
import { useRemoveFavorite, useReviewsByTechnician } from "@/hooks";
import { averageRating } from "@/lib/utils";

interface FavoriteTechnicianCardProps {
    technician: UserFavorites;
}

export function FavoriteCard({
    technician,
}: FavoriteTechnicianCardProps) {

    const { setSelectedTechnician, setAddBookingModal, addBookingModal, handleAddBooking, selectedTechnician, setBookingData } = useBookingHandler();
    const { data: reviews = [] } = useReviewsByTechnician(technician.technician.username);
    const navigate = useNavigate();
    const onClick = () => {
        navigate(`/tecnico/detalle/${technician.technician.username}`);
    }
    const handleBooking = () => {
        if (!technician) return;
        setSelectedTechnician(technician);
        setAddBookingModal(true);
    };

    const { mutate } = useRemoveFavorite();
    if (!technician.technician.isActive) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-700/50 rounded-2xl overflow-hidden hover:border-blue-600/50 transition-all group relative"
        >
            {/* Favorite Badge */}
            <div className="absolute top-4 right-4 z-10">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        mutate(technician.technician.id);
                    }}
                    className="bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-full p-2 hover:bg-red-600/30 transition-all"
                >
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                </motion.button>
            </div>

            <div className="p-6">
                {/* Header with Image and Basic Info */}
                <div className="flex gap-4 mb-6 cursor-pointer">
                    <div className="relative flex-shrink-0">
                        <UserAvatar
                            photoUrl={technician.technician.profilePhotoUrl}
                            size="xl"
                            className="text-4xl"
                        />
                        {technician.technician.isActive && (
                            <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-1.5 ring-4 ring-zinc-900">
                                <BadgeCheck className="h-4 w-4 text-white" />
                            </div>
                        )}
                        {!technician.technician.isActive && (
                            <div className="absolute -bottom-2 -right-2 bg-red-600 rounded-full p-1.5 ring-4 ring-zinc-900">
                                <BadgeCheck className="h-4 w-4 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0" onClick={onClick}>
                                <h3 className="text-white text-lg group-hover:text-blue-400 transition-colors truncate">
                                    {technician.technician.firstName} {technician.technician.lastName}
                                </h3>
                                <p className="text-blue-400 text-sm capitalize">{technician.technician.specialization ?? "Servicio Desconocido"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                {/* TODO: Cambiar por el average rating */}
                                <span className="text-white text-sm">{averageRating(reviews) ?? "N/A"}</span>
                                <span className="text-zinc-500 text-xs">({reviews.length ?? "0"})</span>
                            </div>
                            {technician.technician.isActive && (
                                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs">
                                    Disponible
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Location and Distance Info */}
                <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-zinc-800">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="bg-zinc-800/50 rounded-lg p-2">
                            <MapPin className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500">Ubicación</p>
                            <p className="text-white">{technician.technician.address}</p>
                        </div>
                    </div>

                    {/* <div className="flex items-center gap-2 text-sm">
                        <div className="bg-zinc-800/50 rounded-lg p-2">
                            <Navigation className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500">Distancia</p>
                            <p className="text-white">{technician.technician.distance}</p>
                        </div>
                    </div> */}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBooking();
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <BookIcon className="h-4 w-4 mr-2" />
                        Reservar
                    </Button>
                    <Button
                        onClick={onClick}
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white group/btn"
                    >
                        Ver perfil
                        <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
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
            {/* Gradient Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    );
}
