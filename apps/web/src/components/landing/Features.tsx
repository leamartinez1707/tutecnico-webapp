import { motion } from "motion/react";
import { Shield, MapPin, Clock, Star, DollarSign, Users } from "lucide-react";

const features = [
    {
        icon: MapPin,
        title: "Mapa Interactivo",
        description: "Visualizá técnicos cerca de tu ubicación en tiempo real",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: Shield,
        title: "Perfiles Verificados",
        description: "Todos los técnicos pasan por un proceso de verificación",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        icon: Star,
        title: "Sistema de Calificaciones",
        description: "Conocé la experiencia de otros usuarios antes de elegir",
        gradient: "from-yellow-500 to-orange-500",
    },
    {
        icon: Clock,
        title: "Disponibilidad 24/7",
        description: "Encontrá técnicos disponibles en cualquier momento",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        icon: DollarSign,
        title: "Precios Transparentes",
        description: "Compará precios y elegí la mejor opción para vos",
        gradient: "from-green-500 to-emerald-500",
    },
    {
        icon: Users,
        title: "Comunidad Confiable",
        description: "Miles de usuarios satisfechos en todo Uruguay",
        gradient: "from-red-500 to-orange-500",
    },
];

export function Features() {
    return (
        <section id="features" className="relative py-24 px-4 bg-gradient-to-b from-zinc-900 via-black to-zinc-900">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl mb-4 text-white">
                        La plataforma que estabas esperando
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Tecnología innovadora para conectar profesionales con quienes necesitan sus servicios
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group"
                        >
                            <div className="h-full bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 hover:border-zinc-600 transition-all">
                                <div className="mb-6">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="h-7 w-7 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-xl text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-20"
                >
                    <div className="bg-gradient-to-r from-blue-600/10 via-emerald-600/10 to-blue-600/10 border border-zinc-700/50 rounded-2xl p-12 text-center">
                        <h3 className="text-3xl text-white mb-4">
                            Construyendo confianza desde el día uno
                        </h3>
                        <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
                            Estamos creando una plataforma segura y confiable. Cada técnico será verificado y todas las interacciones estarán protegidas para garantizar la mejor experiencia.
                        </p>
                        <div className="flex flex-wrap justify-center gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Shield className="h-8 w-8 text-blue-400" />
                                </div>
                                <div className="text-zinc-300">Pagos Seguros</div>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Users className="h-8 w-8 text-emerald-400" />
                                </div>
                                <div className="text-zinc-300">Soporte 24/7</div>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Star className="h-8 w-8 text-purple-400" />
                                </div>
                                <div className="text-zinc-300">Garantía de Calidad</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}