import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Home, RefreshCcw, Phone } from 'lucide-react';
import { logger } from '@/utils/logger';

const PaymentFailurePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');
        const statusDetail = searchParams.get('status_detail');

        logger.error('Payment failure page loaded', {
            paymentId,
            status,
            statusDetail,
        });
    }, [searchParams]);

    const handleRetry = () => {
        navigate('/panel/tecnico');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full shadow-2xl border-2 border-red-200">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-4">
                        <XCircle className="w-12 h-12 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                        Pago No Procesado
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                        No pudimos procesar tu pago en este momento
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Mensaje de error */}
                    <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
                        <p className="text-center text-red-800 font-semibold mb-2">
                            ⚠️ El pago no se completó correctamente
                        </p>
                        <p className="text-center text-sm text-red-700">
                            Tu suscripción no ha sido activada. No se ha realizado ningún cargo a tu cuenta.
                        </p>
                    </div>

                    {/* Información del intento */}
                    {(searchParams.get('payment_id') || searchParams.get('status_detail')) && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-3">Detalles del intento:</h3>
                            <div className="space-y-2 text-sm">
                                {searchParams.get('payment_id') && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">ID de Referencia:</span>
                                        <span className="font-semibold text-gray-900">
                                            {searchParams.get('payment_id')}
                                        </span>
                                    </div>
                                )}
                                {searchParams.get('status_detail') && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Detalle:</span>
                                        <span className="font-semibold text-gray-900">
                                            {searchParams.get('status_detail')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Posibles causas */}
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <h3 className="font-bold text-gray-900 mb-3">Posibles causas:</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 mt-0.5">•</span>
                                <span>Fondos insuficientes en tu cuenta</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 mt-0.5">•</span>
                                <span>Datos de la tarjeta incorrectos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 mt-0.5">•</span>
                                <span>Límite de compras alcanzado</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 mt-0.5">•</span>
                                <span>Problemas de conexión durante el proceso</span>
                            </li>
                        </ul>
                    </div>

                    {/* Recomendaciones */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-xl">💡</span>
                            ¿Qué puedes hacer?
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">✓</span>
                                <span>Verifica los datos de tu tarjeta o método de pago</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">✓</span>
                                <span>Intenta con otro método de pago</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">✓</span>
                                <span>Contacta a tu banco si el problema persiste</span>
                            </li>
                        </ul>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            onClick={handleRetry}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Intentar Nuevamente
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

                    {/* Soporte */}
                    <div className="text-center border-t pt-4">
                        <p className="text-sm text-gray-600 mb-2">¿Necesitas ayuda?</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                        >
                            <Phone className="w-4 h-4 mr-2" />
                            Contactar Soporte
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentFailurePage;
