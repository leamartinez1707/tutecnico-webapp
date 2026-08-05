import { FavoriteCard } from '@/components/user/favorites/FavoriteCard'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'
import { motion } from 'motion/react'
import { UserFavorites } from '@/types';

interface Props {
    favorites: UserFavorites[];
}

const FavoritesGrid = ({ favorites }: Props) => {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-8"
            >
                <div className="text-zinc-400">
                    Mostrando {favorites.length} {favorites.length === 1 ? 'técnico' : 'técnicos'}
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    >
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filtrar
                    </Button>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {favorites.map((technician, index) => (
                    <motion.div
                        key={technician.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                    >
                        <FavoriteCard
                            technician={technician}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </>
    )
}

export default FavoritesGrid