import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import ModalUi from "@/components/modal/ModalUi"
import FormBooking from "@/components/bookings/FormBooking"
import { useBookingHandler } from "@/hooks/useBookingHandler"
import TechCard from "@/components/user/card/TechCard"
import { Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useFavorites } from "@/hooks"

const FavoritesPage = () => {

    const { data: favorites = [], isLoading } = useFavorites();

    const navigate = useNavigate();

    const {
        setBookingData,
        selectedTechnician,
        setSelectedTechnician,
        addBookingModal,
        setAddBookingModal,
        handleAddBooking,

    } = useBookingHandler();

    if (favorites.length === 0 || !isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center max-w-md mx-auto">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full mb-4">
                            <Star className="size-14 fill-amber-400" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight mb-2">No hay técnicos en favoritos</h1>
                        <p className="text-muted-foreground mb-6">
                            Aún no has agregado técnicos a tu lista de favoritos. Explora los técnicos disponibles y agrégalos a tus favoritos para un acceso rápido.
                        </p>
                        <Button className="bg-primary-darky text-white" onClick={() => navigate('/mapa')}>Buscar Técnicos</Button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <motion.div
                        initial={{ scale: 0.5, y: 0 }}
                        animate={{ scale: 1, y: [0, -10, 0] }}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg"
                    >
                        <Star className="size-10 fill-amber-400" />
                    </motion.div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-blue-900">Técnicos favoritos</h1>
                        <p className="text-muted-foreground">Gestiona y reserva con tus técnicos favoritos</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favorites?.map((tech) => (
                        <motion.div
                            key={tech?.technician?.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(59,130,246,0.15)" }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <TechCard
                                technician={tech}
                                setSelectedTechnician={setSelectedTechnician}
                                setAddBookingModal={setAddBookingModal}
                            />
                        </motion.div>
                    ))}
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
        </div >
    );
}

export default FavoritesPage