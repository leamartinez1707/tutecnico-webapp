import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { motion } from 'motion/react'

const EmptyFavorites = ({ onBack }: { onBack?: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
        >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 max-w-md mx-auto">
                <div className="bg-zinc-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-10 w-10 text-zinc-600" />
                </div>
                <h2 className="text-2xl text-white mb-3">
                    No tienes favoritos aún
                </h2>
                <p className="text-zinc-400 mb-6">
                    Empieza a guardar técnicos para acceder a ellos rápidamente
                </p>
                {onBack && (
                    <Button
                        onClick={onBack}
                        className="bg-linear-to-r text-white from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                    >
                        Explorar técnicos
                    </Button>
                )}
            </div>
        </motion.div>
    )
}

export default EmptyFavorites