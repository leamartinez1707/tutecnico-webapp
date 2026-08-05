import { useState } from 'react';
import { Technicians } from '@/types';
import { capitalizeFirstLetter } from '@/utils';
import { MapPin } from 'lucide-react';
import FavoriteIcon from '../user/FavoriteIcon';
import TechnicianModal from '../technician/TechnicianModal';
import UserAvatar from '../ui/UserAvatar';
import { DEFAULT_IMAGE } from '@/const/appInfo';

type Props = {
    tech: (Technicians & {
        distance?: number;
    })
    setAddBookingModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const MapTechCard = ({ tech, setAddBookingModal }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                className="relative flex w-full h-full flex-col rounded-xl bg-clip-border text-gray-700 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onClick={() => setIsModalOpen(true)}
            >
                <div className="relative mx-4 mt-4 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40">
                    <div className="h-80 w-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                        <UserAvatar
                            photoUrl={tech.profilePhotoUrl || DEFAULT_IMAGE}
                            size="xl"
                            className="size-32 text-4xl"
                        />
                    </div>
                    {/* )} */}
                    <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60"></div>
                    <button
                        className="!absolute top-4 right-4 h-8 max-h-[32px] w-8 max-w-[32px] z-10"
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transform">
                            <FavoriteIcon technicianId={tech.id} />
                        </span>
                    </button>
                </div>
                <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h5 className="block font-sans text-xl font-medium leading-snug tracking-normal text-blue-gray-900 antialiased capitalize">
                            {tech.firstName} {tech.lastName}
                        </h5>
                        <p className="flex items-center gap-1.5 font-sans text-base font-normal leading-relaxed text-blue-gray-900 antialiased">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                className="-mt-0.5 h-5 w-5 text-yellow-700"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="font-medium">{tech.averageRating ? tech.averageRating : 'Sin reseñas'}</span>
                        </p>
                    </div>

                    <p className="block font-sans text-base font-light leading-relaxed text-gray-700 antialiased capitalize">
                        {tech.specialization}
                    </p>
                    <div className="my-4">
                        <div className="flex flex-wrap gap-1">
                            {tech.services.slice(0, 3).map((service, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-50 text-black text-xs font-medium text-center rounded-full"
                                >
                                    {capitalizeFirstLetter(service)}
                                </span>
                            ))}
                            {tech.services.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium text-center rounded-full">
                                    +{tech.services.length - 3} más
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>Distancia: {tech.distance ? tech.distance.toString().substring(0, 5) + ' km' : 'No hay datos'}</span>
                    </div>
                </div>
            </div>

            <TechnicianModal
                tech={tech}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                setAddBookingModal={setAddBookingModal}
            />
        </>
    )
}

export default MapTechCard