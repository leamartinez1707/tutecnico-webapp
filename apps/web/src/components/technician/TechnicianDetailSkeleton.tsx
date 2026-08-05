import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Calendar, Clock, Star } from "lucide-react";

const TechnicianDetailSkeleton = () => (
    <div className="min-h-screen bg-black">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center gap-2 text-zinc-400 animate-pulse">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    <div className="h-4 w-20 bg-zinc-700 rounded" />
                </div>
            </div>
        </header>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Section Skeleton */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-br from-zinc-900 to-zinc-800/50 border border-zinc-700/50 rounded-2xl p-8 animate-pulse"
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-zinc-700" />
                                <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2">
                                    <BadgeCheck className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="h-8 w-1/2 bg-zinc-700 rounded" />
                                <div className="h-6 w-1/3 bg-blue-800 rounded" />
                                <div className="flex gap-4">
                                    <div className="h-4 w-24 bg-zinc-700 rounded" />
                                    <div className="h-4 w-16 bg-zinc-700 rounded" />
                                </div>
                                <div className="h-4 w-full bg-zinc-800 rounded mt-4" />
                                <div className="flex gap-2 mt-6">
                                    <div className="h-10 w-32 bg-zinc-700 rounded" />
                                    <div className="h-10 w-32 bg-zinc-700 rounded" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Features Grid Skeleton */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid md:grid-cols-2 gap-4"
                    >
                        <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 flex items-center gap-4 animate-pulse">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="h-4 w-24 bg-zinc-700 rounded mb-2" />
                                <div className="h-4 w-16 bg-zinc-800 rounded" />
                            </div>
                        </div>
                        <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 flex items-center gap-4 animate-pulse">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <div className="h-4 w-24 bg-zinc-700 rounded mb-2" />
                                <div className="h-4 w-16 bg-zinc-800 rounded" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Services Skeleton */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-8 animate-pulse"
                    >
                        <div className="h-6 w-1/3 bg-zinc-700 rounded mb-6" />
                        <div className="grid md:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                    <div className="h-4 w-32 bg-zinc-700 rounded" />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Reviews Skeleton */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-8 animate-pulse"
                    >
                        <div className="h-6 w-1/4 bg-zinc-700 rounded mb-6" />
                        <div className="space-y-6">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-full bg-zinc-700" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-1/2 bg-zinc-700 rounded" />
                                        <div className="h-3 w-1/3 bg-zinc-800 rounded" />
                                        <div className="h-4 w-full bg-zinc-800 rounded" />
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} className="h-4 w-4 text-zinc-600" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-zinc-700/50 rounded-2xl p-6 animate-pulse">
                        <div className="h-5 w-1/2 bg-zinc-700 rounded mb-4" />
                        <div className="h-4 w-full bg-zinc-800 rounded mb-2" />
                        <div className="h-4 w-2/3 bg-zinc-700 rounded" />
                    </div>
                    <div className="bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-zinc-700/50 rounded-2xl p-6 animate-pulse">
                        <div className="h-5 w-1/2 bg-zinc-700 rounded mb-4" />
                        <div className="h-4 w-full bg-zinc-800 rounded mb-2" />
                        <div className="h-4 w-2/3 bg-zinc-700 rounded" />
                    </div>
                    <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-2xl p-6 animate-pulse">
                        <div className="h-5 w-1/3 bg-emerald-400 rounded mb-2" />
                        <div className="h-4 w-full bg-zinc-800 rounded" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default TechnicianDetailSkeleton;