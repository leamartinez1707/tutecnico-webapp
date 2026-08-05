import { capitalizeFirstLetter } from "@/utils";
import FavoriteIcon from "../FavoriteIcon";
import { Book, Building2Icon, Contact, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Technicians } from "@/types";
import { useAllReviews } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type DashboardCardProps = {
    tech: (Technicians & {
        distance?: number;
    })
    setAddBookingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardCard = ({ tech, setAddBookingModal }: DashboardCardProps) => {
    const { data: allReviews = [] } = useAllReviews();
    const { isAuthenticated } = useAuth();
    const reviews = allReviews.length > 0 ? allReviews.filter(review => review.technician.id === tech.id) : [];

    const navigate = useNavigate()

    return (
        <div className="py-4" >
            {/* Header */}
            <div className="flex items-start justify-between mb-2 pb-2 border-b-2">
                <div className="flex items-center gap-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 text-lg capitalize">{tech.firstName} {tech.lastName}</h3>
                        <p className="text-blue-600 text-sm font-medium capitalize"><Building2Icon className="inline-block size-5 mr-1" /> {tech.specialization}</p>
                    </div>
                </div>
                <FavoriteIcon technicianId={tech.id} />
            </div>

            {/* Specialties */}
            <div className="my-4">
                <div className="flex flex-wrap gap-2">
                    {tech.services.map((service, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full text-center"
                        >
                            {capitalizeFirstLetter(service)}
                        </span>
                    ))}
                </div>
            </div>

            {/* Rating and Stats */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{Number(tech.averageRating) || '0 calificaciones'}</span>
                    <span className="text-gray-500">{'('}{reviews?.length ? reviews.length : 'Sin datos'}{')'}</span>
                </div>
            </div>

            {/* Location and Availability */}
            <div className="flex flex-col justify-between mb-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>Distancia: {tech.distance ? tech.distance.toString().substring(0, 5) + ' km' : 'No hay datos'}</span>
                </div>
                <div className="mt-2 flex justify-center items-center gap-2">
                    <Button
                        onClick={() => {
                            if (!isAuthenticated) {
                                navigate('/login')
                                return
                            }
                            setAddBookingModal(true)
                        }}
                        className="flex-1 bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                    >
                        <Book className="h-4 w-4 mr-1" />
                        Enviar reserva
                    </Button>
                    <Button onClick={() => navigate(`/tecnico/detalle/${tech.username}`)} className="flex-1 bg-yellow-500 text-white hover:bg-yellow-800 duration-200 transition-colors">
                        <Contact className="h-4 w-4 mr-1" />
                        Reseñas
                    </Button>
                </div>
            </div >
        </div>
    )
}

export default DashboardCard