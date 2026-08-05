import { DEFAULT_IMAGE } from "@/const/appInfo";
import { useReviewsByTechnician } from "@/hooks";
import type { RecentTechnician } from "@/hooks/useRecentTechnicians";
import { averageRating } from "@/lib/utils";
import { userPaths } from "@/routes/routesConfig";
import { capitalizeFirstLetter } from "@/utils";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

interface RecentTechnicianCardProps {
    technician: RecentTechnician;
    index: number;
}

const RecentTechnicianCard = ({ technician, index }: RecentTechnicianCardProps) => {
    const navigate = useNavigate();
    const handleTechnicianClick = (username: string) => {
        // Navegar a la página de calificación/perfil del técnico
        navigate(userPaths.technicianRating.replace(':username', username));
    };

    const { data: reviews = [] } = useReviewsByTechnician(technician.username);
    return (
        <motion.div
            key={technician.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group cursor-pointer"
            onClick={() => handleTechnicianClick(technician.username)}
        >
            <div className="h-full bg-gradient-to-br from-zinc-900 to-zinc-800/50 border border-zinc-700/50 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
                {/* Header with image */}
                <div className="relative h-48 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10" />
                    <img
                        src={technician.profilePhotoUrl || DEFAULT_IMAGE}
                        alt={technician.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Badge verificado - todos los técnicos registrados están verificados */}
                    <div className="absolute top-4 right-4 z-20">
                        <div className="bg-blue-600 rounded-full p-2">
                            <BadgeCheck className="h-5 w-5 text-white" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Profile info */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl text-white mb-1 group-hover:text-blue-400 transition-colors">
                                {technician.name}
                            </h3>
                            <p className="text-blue-400 capitalize">
                                {capitalizeFirstLetter(technician.specialization)}
                            </p>
                        </div>
                    </div>

                    {/* Services - mostrar primeros 3 */}
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            {technician.services.map((service, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700"
                                >
                                    {capitalizeFirstLetter(service)}
                                </span>
                            ))}
                            {technician.services.length > 3 && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-400 border border-zinc-700">
                                    +{technician.services.length - 3} más
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Footer info */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-700/50">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{technician.address.split(",").slice(1, 3).join(", ")}</span>
                        </div>
                        {/* Mostrar rating placeholder ya que no tenemos reviews cargadas aquí */}
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-white">{averageRating(reviews) ?? "Nuevo"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default RecentTechnicianCard