import { motion } from 'motion/react'

const FavoriteSkeleton = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="h-40 bg-zinc-800 rounded-lg animate-pulse"></div>
                ))}
            </div>
        </motion.div>
    )
}

export default FavoriteSkeleton