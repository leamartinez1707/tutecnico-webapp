import { motion } from "motion/react";
import { Button } from "../ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userPaths, authPaths } from "@/routes/routesConfig";
import { appInfo } from "@/const/appInfo";

export function Hero() {
    const navigate = useNavigate();

    return (
        <div id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black" />

            {/* Animated background orbs */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-20">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-full mb-8">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-sm text-zinc-300">Próximamente en Uruguay</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-6xl md:text-7xl lg:text-8xl mb-6 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        La nueva forma de encontrar técnicos
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {appInfo.name} conecta a técnicos profesionales de todo Uruguay con clientes que necesitan sus servicios. Simple, rápido y efectivo.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <Button
                            size="lg"
                            onClick={() => navigate(userPaths.map)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group"
                        >
                            <MapPin className="mr-2 h-5 w-5" />
                            Ver Mapa de Técnicos
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate(authPaths.register)}
                            className="bg-transparent border-zinc-700 hover:bg-zinc-800 text-white px-8 py-6 text-lg"
                        >
                            Registrate como Técnico
                        </Button>
                    </motion.div>

                    <motion.div
                        className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">+50</div>
                            <div className="text-sm text-zinc-500">Técnicos Registrados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">19</div>
                            <div className="text-sm text-zinc-500">Departamentos</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">100%</div>
                            <div className="text-sm text-zinc-500">Gratis para Usuarios</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex justify-center p-2">
                    <motion.div
                        className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </div>
    );
}