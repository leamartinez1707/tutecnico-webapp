import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Calendar } from 'lucide-react'
import type { LoggedUser } from '@/types'
import UserAvatar from '@/components/ui/UserAvatar'
import ProfilePhotoUpload from '@/components/ui/ProfilePhotoUpload'
import { useUsers } from '@/context/UsersContext'
import { useState } from 'react'

interface BasicInformationProps {
    user: LoggedUser | null
}

const BasicInformation = ({ user }: BasicInformationProps) => {
    const { updateProfilePhoto, removeProfilePhoto } = useUsers();
    const [showPhotoUpload, setShowPhotoUpload] = useState(false);
    
    const joinDate = user?.id ? new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
    }) : '';

    return (
        <Card className="h-fit bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
            <CardContent className="p-6">
                {/* Avatar y nombre */}
                <div className="text-center mb-6">
                    <div className="relative inline-block">
                        {showPhotoUpload ? (
                            <div className="mb-4">
                                <ProfilePhotoUpload
                                    currentPhotoUrl={user?.profilePhotoUrl}
                                    firstName={user?.firstName}
                                    lastName={user?.lastName}
                                    onUpload={async (photoUrl) => {
                                        await updateProfilePhoto(photoUrl);
                                        setShowPhotoUpload(false);
                                    }}
                                    onRemove={async () => {
                                        await removeProfilePhoto();
                                        setShowPhotoUpload(false);
                                    }}
                                />
                            </div>
                        ) : (
                            <div 
                                className="cursor-pointer group"
                                onClick={() => setShowPhotoUpload(true)}
                            >
                                <UserAvatar
                                    photoUrl={user?.profilePhotoUrl}
                                    size="xl"
                                    className="shadow-lg ring-2 ring-white group-hover:ring-blue-300 transition-all"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <User className="w-3 h-3 text-white" />
                                </div>
                                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">Cambiar foto</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <h2 className="text-xl font-bold mt-4 text-gray-900">
                        {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-gray-600 text-sm">@{user?.username}</p>
                </div>

                {/* Status y badges */}
                <div className="space-y-3">
                    <div className="flex justify-center">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Cuenta Activa
                        </Badge>
                    </div>
                    
                    <div className="text-center pt-4 border-t border-blue-100">
                        <div className="flex items-center justify-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            Miembro desde {joinDate}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default BasicInformation