import { motion } from "motion/react";
import { Heart, ArrowLeft, MapPin } from "lucide-react";
import { useFavorites } from "@/hooks";
import { useAuth } from "@/context/AuthContext";
import EmptyFavorites from "@/components/user/favorites/EmptyFavorites";
import FavoriteSkeleton from "@/components/user/favorites/FavoriteSkeleton";
import FavoritesGrid from "./FavoritesGrid";
import SectionErrorBoundary from "@/components/Error/SectionErrorBoundary";
import FavoritesError from "@/components/user/favorites/FavoritesError";

// Datos de ejemplo de técnicos favoritos

export default function FavoritesPage() {
    // const [favorites, setFavorites] = useState<Technician[]>(mockFavorites);

    const user = useAuth().user;
    const { data: favorites = [], isLoading, error } = useFavorites();
    const onBack = () => {
        window.history.back();
    }

    console.log("error", error);
    return (
        <div className="min-h-screen bg-black">
            {/* Header Section */}
            <div className="bg-gradient-to-b from-zinc-900 to-black border-b border-zinc-800 pt-24 pb-8">
                <div className="container mx-auto px-4">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={onBack}
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 group"
                    >
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Volver</span>
                    </motion.button>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center mb-6"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="bg-gradient-to-br from-red-600 to-pink-600 p-4 rounded-2xl">
                                <Heart className="h-8 w-8 text-white fill-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl text-white mb-4">
                            Mis Técnicos Favoritos
                        </h1>
                        <p className="text-xl text-zinc-400">
                            Accede rápidamente a los técnicos que has guardado
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-center gap-6 text-sm"
                    >
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Heart className="h-4 w-4 text-red-400 fill-red-400" />
                            <span>{favorites?.length} técnicos guardados</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400">
                            <MapPin className="h-4 w-4 text-blue-400" />
                            <span>{user?.address}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <SectionErrorBoundary
                    sectionName="Favoritos"
                    fallbackMessage="No pudimos cargar los favoritos. Por favor, recarga la página."
                >
                    {/* Mostrar skeleton */}
                    {isLoading && (
                        <FavoriteSkeleton />
                    )}
                    {!isLoading && favorites.length === 0 && (
                        <EmptyFavorites
                            onBack={onBack}
                        />
                    )}
                    {favorites.length > 0 && (
                        <FavoritesGrid favorites={favorites} />
                    )}
                    {error && favorites.length === 0 && (
                        <FavoritesError />
                    )}
                </SectionErrorBoundary>
            </div>
        </div>
    );
}
