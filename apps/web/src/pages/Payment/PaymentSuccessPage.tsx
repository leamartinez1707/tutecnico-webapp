import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, User } from 'lucide-react';
import { logger } from '@/utils/logger';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');
        const merchantOrderId = searchParams.get('merchant_order_id');

        logger.info('Payment success page loaded', {
            paymentId,
            status,
            merchantOrderId,
        });
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full shadow-2xl border-2 border-green-200">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                        ¡Pago Exitoso!
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                        Tu suscripción premium ha sido activada correctamente
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Mensaje de confirmación */}
                    <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4">
                        <p className="text-center text-green-800 font-semibold">
                            ✓ Tu cuenta premium está activa desde este momento
                        </p>
                    </div>

                    {/* Información del pago */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-3">Detalles del pago:</h3>
                        <div className="space-y-2 text-sm">
                            {searchParams.get('payment_id') && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">ID de Pago:</span>
                                    <span className="font-semibold text-gray-900">
                                        {searchParams.get('payment_id')}
                                    </span>
                                </div>
                            )}
                            {searchParams.get('status') && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Estado:</span>
                                    <span className="font-semibold text-green-600">
                                        {searchParams.get('status')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Beneficios activados */}
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-xl">🎉</span>
                            Beneficios activados:
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                Perfil destacado en búsquedas
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                Acceso prioritario a reservas
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                Sin límite de servicios
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                Estadísticas en tiempo real
                            </li>
                        </ul>
                    </div>

                    {/* Botones de navegación */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <User className="w-4 h-4 mr-2" />
                            Ir al Dashboard
                        </Button>
                        <Button
                            onClick={() => navigate('/')}
                            variant="outline"
                            className="flex-1"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Volver al Inicio
                        </Button>
                    </div>

                    {/* Nota sobre facturación */}
                    <div className="text-center text-xs text-gray-500 pt-2">
                        Recibirás un comprobante de pago por email en los próximos minutos
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentSuccessPage;
