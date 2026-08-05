import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  userName?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;
  className?: string;
}

/**
 * Botón de WhatsApp que abre un chat con un número específico
 * Formatea el número correctamente para Uruguay (+598)
 */
const WhatsAppButton = ({
  phoneNumber,
  message,
  userName,
  size = 'sm',
  variant = 'outline',
  showText = false,
  className = ''
}: WhatsAppButtonProps) => {
  // Limpiar el número de teléfono (remover espacios, guiones, etc.)
  const cleanPhone = phoneNumber?.replace(/\D/g, '') || '';
  
  // Si el número no tiene código de país, agregar 598 (Uruguay)
  const formattedPhone = cleanPhone.startsWith('598') ? cleanPhone : `598${cleanPhone}`;
  
  // Construir mensaje predeterminado si no se proporciona uno
  const defaultMessage = userName 
    ? `Hola ${userName}, te contacto desde ServyFix Uruguay.`
    : 'Hola, te contacto desde ServyFix Uruguay.';
  
  const whatsappMessage = message || defaultMessage;
  
  // Codificar el mensaje para URL
  const encodedMessage = encodeURIComponent(whatsappMessage);
  
  // Construir URL de WhatsApp
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

  // No mostrar botón si no hay número válido
  if (!cleanPhone || cleanPhone.length < 8) {
    return null;
  }

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        type="button"
        size={size}
        variant={variant}
        className={`text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 ${className}`}
        title="Contactar por WhatsApp"
      >
        <MessageCircle className={`${showText ? 'mr-2' : ''} ${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'}`} />
        {showText && 'WhatsApp'}
      </Button>
    </a>
  );
};

export default WhatsAppButton;
