import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { authPaths } from "@/routes/routesConfig";
import { appInfo } from "@/const/appInfo";
import { useRecentTechnicians } from "@/hooks/useRecentTechnicians";
import RecentTechnicianCard from "../technician/RecentTechnicianCard";
import RecentTechnicianSkeleton from "../technician/RecentTechnicianSkeleton";



export function RecentServices() {
    const navigate = useNavigate();
    const { recentTechnicians, isLoading: loadingTechnicians } = useRecentTechnicians(6);
    return (
        <section id="recent-services" className="relative py-24 px-4 bg-gradient-to-b from-black via-zinc-950 to-black">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/10 border border-emerald-600/30 rounded-full mb-4">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-sm text-emerald-400">Próximamente en tu zona</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl mb-4 text-white">
                        Conocé a nuestros últimos técnicos registrados
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                        Profesionales verificados listos para brindarte el mejor servicio
                    </p>
                </motion.div>

                {/* Mensaje si no hay técnicos */}
                {recentTechnicians.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-zinc-400 text-lg mb-6">
                            Aún no hay técnicos registrados. ¡Sé el primero!
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(authPaths.register)}
                            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all"
                        >
                            Registrate como Técnico
                        </motion.button>
                    </div>
                )}
                {/* Mostrar skeleton de tecnicos */}
                {loadingTechnicians && recentTechnicians.length > 0 ? (
                    <RecentTechnicianSkeleton />
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentTechnicians.map((technician, index) => (
                            <RecentTechnicianCard key={technician.id} technician={technician} index={index} />
                        ))}
                    </div>
                )}

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16 text-center"
                >
                    <p className="text-zinc-400 text-lg mb-6">
                        ¿Sos técnico y querés formar parte de {appInfo.name}?
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(authPaths.register)}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all"
                    >
                        Registrate como Técnico
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
