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
        <Card className="h-fit bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700/60 shadow-xl">
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
                                    className="shadow-lg ring-2 ring-zinc-700 group-hover:ring-blue-400 transition-all"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-zinc-800 flex items-center justify-center">
                                    <User className="w-3 h-3 text-white" />
                                </div>
                                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">Cambiar foto</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <h2 className="text-xl font-bold mt-4 text-white">
                        {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-zinc-400 text-sm">@{user?.username}</p>
                </div>

                {/* Status y badges */}
                <div className="space-y-3">
                    <div className="flex justify-center">
                        <Badge variant="secondary" className="bg-green-900/50 text-green-400 border-green-800">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                            Cuenta Activa
                        </Badge>
                    </div>
                    
                    <div className="text-center pt-4 border-t border-zinc-700/60">
                        <div className="flex items-center justify-center text-sm text-zinc-400">
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