import { Button } from '@/components/ui/button'
import { BookIcon } from 'lucide-react'
import { motion } from 'motion/react'

const EmptyBookings = ({ onBack }: { onBack?: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
        >
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 max-w-md mx-auto">
                <div className="bg-zinc-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookIcon className="h-10 w-10 text-zinc-600" />
                </div>
                <h2 className="text-2xl text-white mb-3">
                    No tienes reservas guardadas
                </h2>
                <p className="text-zinc-400 mb-6">
                    Cuando realices reservas, aparecerán aquí para que puedas gestionarlas fácilmente.
                </p>
                {onBack && (
                    <Button
                        onClick={onBack}
                        className="text-white bg-linear-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
                    >
                        Explorar técnicos
                    </Button>
                )}
            </div>
        </motion.div>
    )
}

export default EmptyBookings;