import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Check, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authPaths } from "@/routes/routesConfig";
import { createWhatsAppUrl } from "@/config/contact";

export function Pricing() {
    const navigate = useNavigate();

    return (
        <section id="pricing" className="relative py-24 px-4 bg-black">
            {/* Background decoration */}
            <motion.div
                className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <div className="container mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl mb-4 text-white">
                        Sumate desde el inicio
                    </h2>
                    <p className="text-xl text-zinc-400">
                        Aprovechá las condiciones especiales de lanzamiento
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* User Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ y: -5 }}
                        className="relative"
                    >
                        <div className="h-full bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-2 border-blue-600/30 rounded-3xl p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl text-white">Para Usuarios</h3>
                                    <p className="text-blue-400">Siempre gratis</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-5xl text-white">$0</span>
                                    <span className="text-zinc-400">/ siempre</span>
                                </div>
                                <p className="text-zinc-400">
                                    Acceso completo sin costo alguno
                                </p>
                            </div>
                            <div className="space-y-4 mb-8">
                                {[
                                    "Búsqueda ilimitada de técnicos",
                                    "Acceso completo al mapa",
                                    "Ver perfiles y calificaciones",
                                    "Contactar técnicos directamente",
                                    "Sistema de reseñas",
                                    "Soporte al cliente",
                                ].map((feature, index) => (
                                    <motion.div
                                        key={feature}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                        <span className="text-zinc-300">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <Button
                                onClick={() => navigate(authPaths.register)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
                            >
                                Empezar Gratis
                            </Button>
                        </div>
                    </motion.div>

                    {/* Technician Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        whileHover={{ y: -5 }}
                        className="relative"
                    >
                        {/* Popular badge */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm z-10">
                            Más Popular
                        </div>

                        <div className="h-full bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 border-2 border-emerald-600/30 rounded-3xl p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl text-white">Para Técnicos</h3>
                                    <p className="text-emerald-400">Plan Profesional</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-5xl text-white">$790</span>
                                    <span className="text-zinc-400">/ mes</span>
                                </div>
                                <p className="text-zinc-400">
                                    Inversión mínima, máximo retorno
                                </p>
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    "Perfil destacado en el mapa",
                                    "Acceso a clientes ilimitados",
                                    "Estadísticas y análisis",
                                    "Gestión de servicios",
                                    "Sistema de valoraciones",
                                    "Soporte prioritario",
                                    "Sin comisiones por servicio",
                                    "Cancelación cuando quieras",
                                ].map((feature, index) => (
                                    <motion.div
                                        key={feature}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="flex-shrink-0 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center mt-0.5">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                        <span className="text-zinc-300">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <Button
                                onClick={() => navigate(authPaths.register)}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg group"
                            >
                                Comenzar Ahora
                                <Zap className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Additional info */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16 text-center"
                >
                    <p className="text-zinc-400 mb-4">
                        ¿Querés saber más sobre cómo funciona?
                    </p>
                    <Button
                        variant="link"
                        onClick={() => window.open(createWhatsAppUrl("Hola, quiero saber más sobre ServyFix"), '_blank')}
                        className="text-blue-400 hover:text-blue-300"
                    >
                        Hablá con nuestro equipo →
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}