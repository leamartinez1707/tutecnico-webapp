import { motion } from "motion/react";
import { useState } from "react";
import { Search, MapPin, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { userPaths } from "@/routes/routesConfig";

const popularServices = [
    "Plomería",
    "Electricidad",
    "Aire Acondicionado",
    "Carpintería",
    "Pintura",
    "Cerrajería",
];

export function SearchSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [department, setDepartment] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        // Crear URL params con los valores de búsqueda
        const params = new URLSearchParams();
        if (searchQuery.trim()) {
            params.set('search', searchQuery.trim());
        }
        if (department.trim()) {
            params.set('department', department.trim());
        }
        
        // Navegar al mapa con los parámetros de búsqueda en la URL
        const url = params.toString() ? `${userPaths.map}?${params.toString()}` : userPaths.map;
        navigate(url);
    };

    return (
        <section id="search" className="relative py-20 px-4 bg-gradient-to-b from-black to-zinc-900">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl mb-4 text-white">
                        Descubrí servicios cerca de vos
                    </h2>
                    <p className="text-xl text-zinc-400">
                        Próximamente, encontrá técnicos profesionales en todo Uruguay
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-zinc-800/30 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 shadow-2xl"
                >
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                            <Input
                                type="text"
                                placeholder="¿Qué servicio necesitás? Ej: Plomero, Electricista..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 bg-zinc-900/50 border-zinc-700 focus:border-blue-500 text-white placeholder:text-zinc-500"
                            />
                        </div>
                        <div className="md:w-64 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                            <Input
                                type="text"
                                placeholder="Departamento"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="pl-12 h-14 bg-zinc-900/50 border-zinc-700 focus:border-blue-500 text-white placeholder:text-zinc-500"
                            />
                        </div>
                        <Button
                            size="lg"
                            onClick={handleSearch}
                            className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 group"
                        >
                            <Zap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                            Buscar
                        </Button>
                    </form>

                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm text-zinc-500">Popular:</span>
                        {popularServices.map((service, index) => (
                            <motion.button
                                key={service}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSearchQuery(service)}
                                className="px-4 py-2 bg-zinc-700/30 hover:bg-zinc-700/50 border border-zinc-600/30 hover:border-zinc-500 rounded-full text-sm text-zinc-300 hover:text-white transition-all"
                            >
                                {service}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-8 text-center"
                >
                    <Button
                        variant="link"
                        className="text-blue-400 hover:text-blue-300"
                        onClick={() => navigate(userPaths.map)}
                    >
                        O explorá el mapa completo →
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}