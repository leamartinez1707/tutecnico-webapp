// TODO: Optimizar para evitar re-render de TechnicianDetail al escribir en el formulario de reserva.
//       Posibles soluciones: Portal global para el modal, aislar el estado del formulario, usar useCallback en handlers.
import { motion } from "motion/react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import UserAvatar from "../ui/UserAvatar";
import {
    ArrowLeft,
    MapPin,
    Star,
    Calendar,
    BadgeCheck,
    Clock,
    Mail,
    BookIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { enqueueSnackbar } from "notistack";
import { capitalizeFirstLetter, cutAddress, logger } from "@/utils";
import { averageRating } from "@/lib/utils";
import { useSpecializations } from "@/hooks/queries/useSpecializations";
import { useReviewsByTechnician } from "@/hooks/queries/useReviews";
import { useTechnicianByUsername } from "@/hooks";
import { useBookingHandler } from "@/hooks/useBookingHandler";
import { useEffect } from "react";
import ModalUi from "../modal/ModalUi";
import FormBooking from "../bookings/FormBooking";
import TechnicianDetailSkeleton from "./TechnicianDetailSkeleton";

// Función helper para formatear fecha relativa
const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Hoy";
    if (diffInDays === 1) return "Hace 1 día";
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    }
    const months = Math.floor(diffInDays / 30);
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
};

export function TechnicianDetail() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { data: specializations } = useSpecializations();
    logger.info('Rendering TechnicianDetail for username:', username);
    const { data: technician, isLoading: loadingTechnician, error: errorTechnician } = useTechnicianByUsername(username!);

    console.log(technician);
    const { data: reviews = [], } = useReviewsByTechnician(username!);
    const { setSelectedTechnician, setAddBookingModal, addBookingModal, selectedTechnician, setBookingData, handleAddBooking } = useBookingHandler();

    const reviewCount = reviews.length;
    const rating = averageRating(reviews);

    const handleBooking = () => {
        // Prevenir que un técnico pueda reservar
        if (user?.technician) {
            enqueueSnackbar('Los técnicos no pueden reservar a otros técnicos.', { variant: 'error' });
            return;
        }
        if (!isAuthenticated) {
            if (technician?.username) {
                localStorage.setItem('pendingBookingTechnician', technician.username);
            }
            enqueueSnackbar('Debes iniciar sesión para reservar', { variant: 'warning' });
            navigate('/login');
            return;
        }
        if (!technician) return;
        setSelectedTechnician(technician);
        setAddBookingModal(true);
    };

    // Abrir modal de reserva si viene de login con query reserva=1
    const location = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        // Si el usuario es técnico, nunca abrir el modal de reserva
        if (params.get('reserva') === '1' && technician && !user?.technician) {
            setSelectedTechnician(technician);
            setAddBookingModal(true);
            // Limpiar pendingBookingTechnician solo cuando se abre el modal
            localStorage.removeItem('pendingBookingTechnician');
        }
        // eslint-disable-next-line
    }, [location.search, technician, user?.technician]);

    // Obtener descripción de especialización
    const getSpecializationDescription = (specializationName: string): string => {
        if (!specializations || specializations.items.length === 0) {
            return "Profesional certificado en su área";
        }

        const spec = specializations.items.find(s =>
            s.name.toLowerCase() === specializationName.toLowerCase()
        );
        return spec?.description || "Profesional certificado en su área";
    };

    if (loadingTechnician) {
        return (
            <TechnicianDetailSkeleton />
        );
    }

    if (errorTechnician || !technician) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl text-white mb-2">Error al cargar perfil</h2>
                    <p className="text-zinc-400 mb-6">{errorTechnician?.message || "No se pudo cargar la información del técnico"}</p>
                    <Button onClick={() => navigate(-1)} className="bg-white text-black p-2 hover:scale-110 transition-transform duration-150">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Button>
                </div>
            </div>
        );
    }

    const specializationDescription = getSpecializationDescription(technician.specialization);
    return (
        <div className="min-h-screen bg-black">
            {/* Header with Back Button */}
            <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
                <div className="container mx-auto px-4 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="text-zinc-400 hover:text-white"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Volver
                    </Button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-linear-to-br from-zinc-900 to-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="relative">
                                    <UserAvatar
                                        photoUrl={technician.profilePhotoUrl}
                                        size="xl"
                                        className="ring-4 ring-blue-600/20"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4 relative">
                                        <div className="">
                                            <div className="flex gap-x-2">
                                                <h1 className="text-3xl text-white mb-2 capitalize">
                                                    {technician.firstName} {technician.lastName}
                                                </h1>
                                                {technician.membershipActive &&
                                                    <BadgeCheck className="size-8 text-white bg-blue-600 rounded-full p-2" />
                                                }
                                            </div>

                                            <p className="text-xl text-blue-400 mb-3 capitalize">{technician.specialization}</p>
                                            <div className="flex items-center gap-4 text-sm text-zinc-400 flex-wrap">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{cutAddress(technician.address)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-white">{rating > 0 ? rating.toFixed(1) : '—'}</span>
                                                    {reviews.length > 0 && <span>({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})</span>}
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                    <p className="text-zinc-300 leading-relaxed mb-6">
                                        {specializationDescription}
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        {isAuthenticated ? (
                                            <>
                                                <Button onClick={handleBooking} disabled={!isAuthenticated} variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                                                    <BookIcon className="mr-2 h-4 w-4" />
                                                    Reservar
                                                </Button>
                                            </>
                                        ) : (
                                            <Button onClick={handleBooking} className="bg-blue-600 text-white hover:bg-blue-700 w-full">
                                                Iniciar sesión para contactar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Features Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="grid md:grid-cols-2 gap-4"
                        >
                            <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm text-zinc-400">En ServyFix desde</div>
                                    <div className="text-white">2025</div>
                                </div>
                            </div>
                            <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm text-zinc-400">Respuesta</div>
                                    <div className="text-white">Rápida</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Services Offered */}
                        {technician.services && technician.services.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-8"
                            >
                                <h2 className="text-2xl text-white mb-6">Servicios que ofrezco</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {technician.services.map((service, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                            <span className="text-zinc-300 capitalize">{capitalizeFirstLetter(service)}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Reviews */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl text-white">Reseñas</h2>
                                {reviewCount > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                        <span className="text-xl text-white">{rating > 0 ? rating.toFixed(1) : '—'}</span>
                                        <span className="text-zinc-400">({reviewCount})</span>
                                    </div>
                                )}
                            </div>

                            {reviews.length === 0 ? (
                                <div className="text-center py-12">
                                    <Star className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
                                    <p className="text-zinc-400">Aún no hay reseñas para este técnico</p>
                                    <p className="text-zinc-500 text-sm mt-2">Sé el primero en dejar una opinión</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {reviews.map((review, index) => (
                                        <motion.div
                                            key={review.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="border-b border-zinc-700/50 last:border-0 pb-6 last:pb-0"
                                        >
                                            <div className="flex gap-4">
                                                <UserAvatar
                                                    photoUrl={review.user.profilePhotoUrl}
                                                    size="md"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <div className="text-white capitalize">
                                                                {review.user.firstName} {review.user.lastName}
                                                            </div>
                                                            <div className="text-sm text-zinc-500">
                                                                {getRelativeTime(review.date)}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 ${i < review.rating
                                                                        ? "text-yellow-500 fill-yellow-500"
                                                                        : "text-zinc-600"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-zinc-300">{review.comment}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="sticky top-24 space-y-6"
                        >
                            {/* Contact Card */}
                            <div className="bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-zinc-700/50 rounded-2xl p-6">
                                <h3 className="text-xl text-white mb-4">Contacto</h3>
                                {!isAuthenticated && (
                                    <div className="mb-4 p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                                        <p className="text-sm text-blue-300">
                                            Inicia sesión para contactar al técnico
                                        </p>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    <Button
                                        onClick={handleBooking}
                                        disabled={!isAuthenticated}
                                        variant="outline"
                                        className="w-full text-white border-zinc-700 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Mail className="mr-2 h-4 w-4" />
                                        {isAuthenticated ? 'Reservar' : 'Inicia sesión para reservar'}
                                    </Button>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-zinc-700/50 rounded-2xl p-6">
                                <h3 className="text-xl text-white mb-4">Ubicación</h3>
                                <div className="flex items-start gap-3 text-zinc-300">
                                    <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                                    <span>{cutAddress(technician.address)}</span>
                                </div>
                            </div>

                            {/* Verified Badge */}
                            <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-2xl p-6">
                                <div className="flex items-start gap-3">
                                    <BadgeCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-emerald-400 mb-1">Perfil Verificado</div>
                                        <p className="text-sm text-zinc-400">
                                            Este técnico ha sido verificado por ServyFix
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
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