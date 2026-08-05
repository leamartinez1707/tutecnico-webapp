import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, AlertCircle, Zap, TrendingUp } from "lucide-react";
import { memo, useMemo, useState } from "react";
import RenewalModal from "./RenewalModal";
import MercadoPagoDialog from "../mercadopago/MercadoPagoDialog";

export interface MembershipCardProps {
    membershipType: string;
    membershipActive: boolean;
    membershipExpiresAt?: string;
}

const MembershipCard = memo(({
    membershipType = 'NONE',
    membershipActive = false,
    membershipExpiresAt,
}: MembershipCardProps) => {
    const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
    const [isMercadoPagoModalOpen, setIsMercadoPagoModalOpen] = useState(false);
    const [selectedPlanType, setSelectedPlanType] = useState<'monthly' | 'yearly'>('monthly');

    // Memoizar el estilo de la membresía
    const style = useMemo(() => {
        if (!membershipActive) {
            return {
                bgColor: 'bg-gray-50 border-gray-300',
                iconColor: 'text-gray-400',
                badgeVariant: 'secondary' as const,
                icon: AlertCircle,
                title: 'Sin Suscripción Activa',
                description: 'Activa una suscripción para desbloquear todas las funcionalidades'
            };
        }

        switch (membershipType) {
            case 'TRIAL':
                return {
                    bgColor: 'bg-blue-50 border-blue-300',
                    iconColor: 'text-blue-600',
                    badgeVariant: 'default' as const,
                    icon: Sparkles,
                    title: 'Periodo de Prueba',
                    description: 'Estás en el periodo de prueba gratuito'
                };
            case 'PAID':
                return {
                    bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300',
                    iconColor: 'text-amber-600',
                    badgeVariant: 'default' as const,
                    icon: Crown,
                    title: 'Suscripción Premium',
                    description: 'Tienes acceso completo a todas las funcionalidades'
                };
            default:
                return {
                    bgColor: 'bg-gray-50 border-gray-300',
                    iconColor: 'text-gray-400',
                    badgeVariant: 'secondary' as const,
                    icon: AlertCircle,
                    title: 'Sin Suscripción',
                    description: 'Activa una suscripción para comenzar'
                };
        }
    }, [membershipActive, membershipType]);

    // Memoizar la información de expiración
    const expirationInfo = useMemo(() => {
        if (!membershipExpiresAt) return null;

        const expirationDate = new Date(membershipExpiresAt);
        const today = new Date();
        const daysRemaining = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        const formattedDate = expirationDate.toLocaleDateString('es-UY', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        return {
            formatted: formattedDate,
            daysRemaining,
            isExpiringSoon: daysRemaining <= 7 && daysRemaining > 0
        };
    }, [membershipExpiresAt]);

    const Icon = style.icon;

    const handleOpenCheckout = (planType: 'monthly' | 'yearly') => {
        setSelectedPlanType(planType);
        setIsMercadoPagoModalOpen(true);
    };

    return (
        <Card className={`${style.bgColor} border-2 shadow-md hover:shadow-lg transition-all duration-200`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${style.bgColor} border-2 ${style.bgColor.replace('bg-', 'border-')}`}>
                            <Icon className={`w-6 h-6 ${style.iconColor}`} />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                {style.title}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-600">
                                {style.description}
                            </CardDescription>
                        </div>
                    </div>
                    <Badge
                        variant={style.badgeVariant}
                        className={`
                            ${membershipActive && membershipType === 'PAID' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}
                            ${membershipActive && membershipType === 'TRIAL' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                        `}
                    >
                        {membershipActive ? (membershipType === 'TRIAL' ? 'Prueba' : 'Premium') : 'Inactiva'}
                    </Badge>
                </div>
            </CardHeader>

            {membershipActive && expirationInfo && (
                <CardContent className="pt-0">
                    <div className={`p-3 rounded-lg ${expirationInfo.isExpiringSoon ? 'bg-red-100 border border-red-300' : 'bg-white/50 border border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600 font-medium mb-1">
                                    {expirationInfo.isExpiringSoon ? '⚠️ Vence pronto' : 'Válida hasta'}
                                </p>
                                <p className={`text-sm font-semibold ${expirationInfo.isExpiringSoon ? 'text-red-700' : 'text-gray-900'}`}>
                                    {expirationInfo.formatted}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-600 font-medium mb-1">Días restantes</p>
                                <p className={`text-2xl font-bold ${expirationInfo.isExpiringSoon ? 'text-red-600' : 'text-gray-900'}`}>
                                    {expirationInfo.daysRemaining}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}

            {!membershipActive && (
                <CardContent className="pt-0 pb-4">
                    <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-2 border-amber-200 mb-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-xl">💡</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-amber-900 mb-1">
                                    ¡Potenciá tu negocio hoy!
                                </p>
                                <p className="text-sm text-amber-800">
                                    Activá tu suscripción para aparecer en el mapa, recibir más solicitudes de clientes y hacer crecer tu negocio.
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-2 py-1 bg-white rounded-md text-xs font-semibold text-amber-800 border border-amber-300">
                                        ✓ Visibilidad 24/7
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 bg-white rounded-md text-xs font-semibold text-amber-800 border border-amber-300">
                                        ✓ Más clientes
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 bg-white rounded-md text-xs font-semibold text-amber-800 border border-amber-300">
                                        ✓ Sin comisiones
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Planes de suscripción */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Plan Mensual */}
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-200 hover:border-blue-400 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-5 h-5 text-blue-600" />
                                <h4 className="font-bold text-gray-900">Plan Mensual</h4>
                            </div>
                            <div className="mb-3">
                                <span className="text-3xl font-black text-blue-600">$490</span>
                                <span className="text-sm text-gray-600">/mes</span>
                            </div>
                            <ul className="space-y-1 mb-4 text-xs text-gray-700">
                                <li className="flex items-center gap-1">
                                    <span className="text-green-600">✓</span> Perfil destacado
                                </li>
                                <li className="flex items-center gap-1">
                                    <span className="text-green-600">✓</span> Reservas prioritarias
                                </li>
                                <li className="flex items-center gap-1">
                                    <span className="text-green-600">✓</span> Sin límites
                                </li>
                            </ul>
                            <Button
                                onClick={() => handleOpenCheckout('monthly')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                            >
                                Activar ahora
                            </Button>
                        </div>

                        {/* Plan Anual - Destacado */}
                        <div className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border-2 border-indigo-300 relative">
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                Ahorrás 16%
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-indigo-600" />
                                <h4 className="font-bold text-gray-900">Plan Anual</h4>
                            </div>
                            <div className="mb-1">
                                <span className="text-3xl font-black text-indigo-600">$4.940</span>
                                <span className="text-sm text-gray-600">/año</span>
                            </div>
                            <p className="text-xs text-green-700 font-semibold mb-3">
                                ¡2 meses gratis!
                            </p>
                            <ul className="space-y-1 mb-4 text-xs text-gray-700">
                                <li className="flex items-center gap-1">
                                    <span className="text-green-600">✓</span> Todo lo del plan mensual
                                </li>
                                <li className="flex items-center gap-1">
                                    <span className="text-green-600">✓</span> Soporte prioritario
                                </li>
                                <li className="flex items-center gap-1">
                                    <span className="text-green-600">✓</span> Badge verificado
                                </li>
                            </ul>
                            <Button
                                onClick={() => handleOpenCheckout('yearly')}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                                size="sm"
                            >
                                Activar ahora
                            </Button>
                        </div>
                    </div>
                </CardContent>
            )}

            {/* Modal de Mercado Pago */}
            <MercadoPagoDialog
                isOpen={isMercadoPagoModalOpen}
                onClose={() => setIsMercadoPagoModalOpen(false)}
                planType={selectedPlanType}
            />

            {/* Modal de renovación */}
            <RenewalModal
                isOpen={isRenewalModalOpen}
                onClose={() => setIsRenewalModalOpen(false)}
                currentMembershipType={membershipType}
            // onSubmitProof={handleRenewalSubmit}
            />
        </Card>
    );
});

MembershipCard.displayName = 'MembershipCard';

export default MembershipCard;
