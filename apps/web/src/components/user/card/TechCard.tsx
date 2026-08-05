import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FavoriteIcon from '@/components/user/FavoriteIcon';
import type { Technicians, UserFavorites } from '@/types';
import { capitalizeFirstLetter } from '@/utils';
import { Calendar, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '@/components/ui/UserAvatar';
import { DEFAULT_IMAGE } from '@/const/appInfo';

type TechCardProps = {
    technician: UserFavorites;
    setSelectedTechnician: React.Dispatch<React.SetStateAction<Partial<Technicians> | null>>
    setAddBookingModal: React.Dispatch<React.SetStateAction<boolean>>
}

const TechCard = ({ technician: tech, setAddBookingModal, setSelectedTechnician }: TechCardProps) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    // TODO: Arreglar type cuando mateo cambie la response
    return (
        <Card className="overflow-hidden h-full bg-linear-to-br from-gray-50 to-white shadow-md border border-gray-200 rounded-xl transition-transform hover:scale-[1.025]">
            <CardContent className="flex flex-col justify-between h-full p-5">
                <CardDescription className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <UserAvatar
                            photoUrl={tech.technician.profilePhotoUrl || DEFAULT_IMAGE}
                            size="md"
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold text-gray-900 capitalize leading-tight">
                                    Nombre y Apellido
                                </CardTitle>
                                <FavoriteIcon technicianId={tech.technician.id} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-blue-700 capitalize bg-blue-50 px-2 py-1 rounded text-sm">
                            {tech?.technician?.specialization}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        {tech?.technician?.services.length > 0 && tech?.technician?.services.map((service, index) => (
                            <Badge key={index} className="text-xs px-2 py-1 bg-black text-white rounded">
                                {capitalizeFirstLetter(service)}
                            </Badge>
                        ))}
                    </div>
                    <hr className="my-2 mb-4 border-gray-200" />
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="size-4 text-blue-500" />
                        <span className="text-gray-700 capitalize font-medium">
                            {tech?.technician?.distance ? `${tech.technician.distance} km` : 'Distancia no disponible'}
                        </span>
                    </div>
                </CardDescription>
                <hr className="border-gray-200" />
                <div className="flex gap-3 mt-2">
                    <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
                        onClick={() => {
                            const selectedTech: Partial<Technicians> = {
                                id: tech?.technician?.id,
                                specialization: tech?.technician?.specialization,
                                services: tech?.technician?.services,
                                profilePhotoUrl: tech.technician.profilePhotoUrl ?? "",
                            };
                            setSelectedTechnician(selectedTech);
                            if (!isAuthenticated) {
                                navigate('/login');
                                return
                            }
                            setAddBookingModal(true)
                        }}
                    >
                        <Calendar className="h-4 w-4 mr-2" />
                        Reservar
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default TechCard