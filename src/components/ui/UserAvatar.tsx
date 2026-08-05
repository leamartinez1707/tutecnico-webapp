import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface UserAvatarProps {
  photoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackBgColor?: string;
}

const sizeClasses = {
  sm: 'size-8 text-xs',
  md: 'size-12 text-lg',
  lg: 'size-16 text-xl',
  xl: 'size-24 text-3xl'
};

/**
 * Componente UserAvatar reutilizable
 * Muestra foto de perfil si existe, sino muestra ícono por defecto
 */
const UserAvatar = ({
  photoUrl,
  size = 'md',
  className = '',
  fallbackBgColor = 'bg-gray-800'
}: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  const sizeClass = sizeClasses[size];

  return (
    <Avatar className={`${sizeClass} ${className}`}>
      {photoUrl && !imageError ? (
        <AvatarImage
          src={photoUrl}
          alt="User Avatar"
          className="object-cover"
          decoding='async'
          loading='lazy'
          onError={() => setImageError(true)}
        />
      ) : null}
      <AvatarFallback className={`text-white font-semibold ${fallbackBgColor}`}>
        <UserIcon className="w-1/2 h-1/2" />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
