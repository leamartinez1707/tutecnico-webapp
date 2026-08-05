import { Shield, Lock, CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { memo, useMemo, useEffect } from 'react';
import { useCreateCheckout } from '@/hooks/mutations/useCheckoutMutations';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface MercadoPagoModalProps {
    planType: 'monthly' | 'yearly';
}

const MercadoPagoModal = memo(({ planType }: MercadoPagoModalProps) => {
    const { user } = useAuth();
    const createCheckout = useCreateCheckout();

    // Abrir el init_point en una nueva pestaña cuando la mutación sea exitosa
    useEffect(() => {
        if (createCheckout.isSuccess && createCheckout.data?.init_point) {
            window.open(createCheckout.data.init_point, '_blank');
        }
    }, [createCheckout.isSuccess, createCheckout.data]);

    // Generar URLs de retorno dinámicamente
    const checkoutUrls = useMemo(() => {
        const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
        return {
            successUrl: `${baseUrl}/pago-exitoso`,
            failureUrl: `${baseUrl}/pago-fallido`,
            pendingUrl: `${baseUrl}/pago-pendiente`,
        };
    }, []);

    const handleCheckout = () => {
        if (!user?.technician?.id) {
            return;
        }

        createCheckout.mutate({
            technicianId: user.technician.id,
            planType,
            ...checkoutUrls,
        });
    };

    // Información del plan
    const planInfo = useMemo(() => {
        if (planType === 'monthly') {
            return {
                name: 'Plan Mensual',
                price: '$490',
                period: '/mes',
                features: [
                    'Perfil destacado en búsquedas',
                    'Acceso prioritario a reservas',
                    'Sin límite de servicios',
                    'Estadísticas en tiempo real',
                ]
            };
        }
        return {
            name: 'Plan Anual',
            price: '$4.940',
            period: '/año',
            savings: 'Ahorrás 2 meses',
            features: [
                'Todos los beneficios del plan mensual',
                'Ahorro del 16%',
                'Soporte prioritario',
                'Badge exclusivo de "Profesional Verificado"',
            ]
        };
    }, [planType]);

    return (
        <div className="space-y-4">
            {/* Información del plan seleccionado */}
            <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{planInfo.name}</h3>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-black">{planInfo.price}</span>
                    <span className="text-lg text-blue-100">{planInfo.period}</span>
                </div>
                {planInfo.savings && (
                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mt-2">
                        <span className="text-sm font-semibold">✨ {planInfo.savings}</span>
                    </div>
                )}
                <div className="mt-4 space-y-2">
                    {planInfo.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-white shrink-0" />
                            <span className="text-sm text-blue-50">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección de confianza y seguridad */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Pago 100% Seguro</h3>
                        <p className="text-sm text-blue-700">Protegido por Mercado Pago</p>
                    </div>
                </div>

                <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Datos protegidos con encriptación</p>
                            <p className="text-xs text-gray-600">Tu información está completamente segura</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Activación inmediata</p>
                            <p className="text-xs text-gray-600">Tu suscripción se activa al instante</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Cancela cuando quieras</p>
                            <p className="text-xs text-gray-600">Sin compromisos de permanencia</p>
                        </div>
                    </div>
                </div>

                {/* Métodos de pago aceptados */}
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <p className="text-xs font-semibold text-gray-700">Métodos de pago aceptados:</p>
                    </div>
                    <p className="text-xs text-gray-600">
                        💳 Tarjetas de crédito y débito • 🏦 Transferencia bancaria • 💰 Efectivo en puntos de pago
                    </p>
                </div>
            </div>

            {/* Botón principal de Mercado Pago */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-semibold text-green-700">Conexión segura SSL</span>
                    </div>
                    <img
                        src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.21.1/mercadopago/logo__large.png"
                        alt="Mercado Pago"
                        className="h-5"
                    />
                </div>

                {/* Botón de pago personalizado */}
                <Button
                    onClick={handleCheckout}
                    disabled={createCheckout.isPending || !user?.technician?.id}
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                    {createCheckout.isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <Lock className="w-5 h-5" />
                            <span>Proceder al pago seguro</span>
                        </>
                    )}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-3">
                    Al hacer clic, serás redirigido a la plataforma segura de Mercado Pago
                </p>
            </div>
        </div>
    );
});

MercadoPagoModal.displayName = 'MercadoPagoModal';

export default MercadoPagoModal;