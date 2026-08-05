import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Home, RefreshCw, Info } from 'lucide-react';
import { logger } from '@/utils/logger';

const PaymentPendingPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');
        const merchantOrderId = searchParams.get('merchant_order_id');

        logger.info('Payment pending page loaded', {
            paymentId,
            status,
            merchantOrderId,
        });
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full shadow-2xl border-2 border-amber-200">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <Clock className="w-12 h-12 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                        Pago Pendiente
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                        Tu pago está en proceso de confirmación
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Mensaje de estado */}
                    <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-4">
                        <p className="text-center text-amber-900 font-semibold mb-2">
                            ⏳ Estamos procesando tu pago
                        </p>
                        <p className="text-center text-sm text-amber-800">
                            Tu suscripción se activará automáticamente una vez confirmado el pago.
                        </p>
                    </div>

                    {/* Información del pago */}
                    {searchParams.get('payment_id') && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-3">Detalles del pago:</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">ID de Pago:</span>
                                    <span className="font-semibold text-gray-900">
                                        {searchParams.get('payment_id')}
                                    </span>
                                </div>
                                {searchParams.get('status') && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Estado:</span>
                                        <span className="font-semibold text-amber-600">
                                            {searchParams.get('status')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Información sobre pagos pendientes */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start gap-3 mb-3">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">¿Por qué está pendiente?</h3>
                                <p className="text-sm text-gray-700">
                                    Algunos métodos de pago requieren un tiempo adicional para confirmar la transacción.
                                </p>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-700 ml-8">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Transferencias bancarias: hasta 2 días hábiles</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Pagos en efectivo: confirmación al recibir el comprobante</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span>Otros métodos: verificación según entidad bancaria</span>
                            </li>
                        </ul>
                    </div>

                    {/* Próximos pasos */}
                    <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="text-xl">📋</span>
                            Próximos pasos:
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">1.</span>
                                <span>Recibirás un email de confirmación cuando el pago sea aprobado</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">2.</span>
                                <span>Tu suscripción se activará automáticamente</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600 mt-0.5">3.</span>
                                <span>Podrás acceder a todos los beneficios premium de inmediato</span>
                            </li>
                        </ul>
                    </div>

                    {/* Recordatorio */}
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-sm text-purple-900 font-semibold mb-2">
                            💡 Recordá guardar tu comprobante de pago
                        </p>
                        <p className="text-sm text-purple-800">
                            Si realizaste un pago en efectivo o transferencia, conservá el comprobante hasta que se confirme la transacción.
                        </p>
                    </div>

                    {/* Botones de navegación */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Ver Estado en Dashboard
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

                    {/* Nota de contacto */}
                    <div className="text-center text-xs text-gray-500 pt-2 border-t">
                        <p>¿Tienes dudas sobre el estado de tu pago?</p>
                        <p className="mt-1">Podés verificarlo en tu dashboard o contactarnos para más información</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentPendingPage;
