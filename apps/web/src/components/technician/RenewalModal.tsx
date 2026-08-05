import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Copy, Check, AlertCircle, Sparkles, Crown } from "lucide-react";
import { openWhatsApp, CONTACT_CONFIG } from "@/config/contact";
import { logger } from "@/utils/logger";
import { appInfo } from "@/const/appInfo";

interface RenewalModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentMembershipType?: string;
    // onSubmitProof: (proofData: ProofOfPayment) => Promise<void>;
}

export interface ProofOfPayment {
    membershipType: string;
    transactionReference: string;
    transactionDate: string;
    amount: number;
    bankAccount: string;
}

const MEMBERSHIP_PLANS = {
    TRIAL: {
        name: "Periodo de Prueba",
        price: 0,
        duration: "14 días",
        icon: Sparkles,
        color: "blue",
        features: [
            "Acceso limitado a funcionalidades",
            "Hasta 5 reservas por mes",
            "Soporte por email",
        ],
    },
    PAID: {
        name: "Plan Premium",
        price: 790,
        duration: "30 días",
        icon: Crown,
        color: "amber",
        features: [
            "Acceso completo a todas las funcionalidades",
            "Reservas ilimitadas",
            "Prioridad en resultados de búsqueda",
            "Soporte prioritario 24/7",
            "Estadísticas detalladas",
        ],
    },
};

const BANK_ACCOUNT_INFO = {
    bank: "Banco República",
    accountNumber: "001-123456-78",
    accountType: "Caja de Ahorro",
    holder: appInfo.name,
    rut: "21.123.456-0001",
};

const RenewalModal = ({ isOpen, onClose, currentMembershipType, }: RenewalModalProps) => {
    const [selectedPlan, setSelectedPlan] = useState<"TRIAL" | "PAID">("PAID");
    const [transactionReference, setTransactionReference] = useState("");
    const [transactionDate, setTransactionDate] = useState("");
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<"select" | "payment" | "proof">("select");

    const selectedPlanInfo = MEMBERSHIP_PLANS[selectedPlan];

    logger.debug('RenewalModal abierto', { currentMembership: currentMembershipType });

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleSubmit = async () => {
        if (!transactionReference || !transactionDate) {
            return;
        }

        setIsSubmitting(true);
        try {
            // Formatear la fecha para mostrar en español
            const formattedDate = new Date(transactionDate).toLocaleDateString('es-UY', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // Crear mensaje para WhatsApp
            const message = `
*Solicitud de Activación de Suscripción*
━━━━━━━━━━━━━━━━━━━━━

*Datos del Plan:*
• Plan: ${selectedPlanInfo.name}
• Monto: $${selectedPlanInfo.price}
• Duración: ${selectedPlanInfo.duration}

*Datos de la Transferencia:*
• Número de referencia: ${transactionReference}
• Fecha de transferencia: ${formattedDate}
• Cuenta destino: ${BANK_ACCOUNT_INFO.accountNumber}
• Banco: ${BANK_ACCOUNT_INFO.bank}

━━━━━━━━━━━━━━━━━━━━━
Adjunto el comprobante de pago.

Quedo a la espera de la confirmación.
¡Gracias!
            `.trim();

            // Abrir WhatsApp con el mensaje
            openWhatsApp(message);

            // Si hay función de callback, llamarla (para futuras integraciones con backend)
            // if (onSubmitProof) {
            //     await onSubmitProof({
            //         membershipType: selectedPlan,
            //         transactionReference,
            //         transactionDate,
            //         amount: selectedPlanInfo.price,
            //         bankAccount: BANK_ACCOUNT_INFO.accountNumber,
            //     });
            // }

            // Limpiar formulario y cerrar modal
            setTransactionReference("");
            setTransactionDate("");
            setStep("select");
            onClose();
        } catch (error) {
            logger.error('Error al enviar comprobante', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep("select");
        setTransactionReference("");
        setTransactionDate("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Step 1: Selección de Plan */}
                {step === "select" && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Renovar Suscripción</DialogTitle>
                            <DialogDescription>
                                Selecciona el plan que mejor se adapte a tus necesidades
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Plan Premium */}
                            <div
                                onClick={() => setSelectedPlan("PAID")}
                                className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${selectedPlan === "PAID"
                                    ? "border-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg"
                                    : "border-gray-200 hover:border-amber-300"
                                    }`}
                            >
                                {selectedPlan === "PAID" && (
                                    <div className="absolute top-3 right-3">
                                        <Badge className="bg-amber-500 text-white">Seleccionado</Badge>
                                    </div>
                                )}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                                        <Crown className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">Plan Premium</h3>
                                        <div className="flex items-baseline gap-2 mt-2">
                                            <span className="text-3xl font-bold text-amber-600">$790</span>
                                            <span className="text-gray-500">/ 30 días</span>
                                        </div>
                                        <ul className="mt-4 space-y-2">
                                            {MEMBERSHIP_PLANS.PAID.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <Check className="w-4 h-4 text-amber-600" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Información importante */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex gap-2">
                                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-900">
                                        <p className="font-semibold mb-1">Importante:</p>
                                        <p>
                                            Tu suscripción será activada una vez que verifiquemos tu pago.
                                            Esto puede tomar entre 24-48 horas hábiles.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => setStep("payment")}
                                className="bg-amber-500 hover:bg-amber-600 text-white"
                            >
                                Continuar al pago
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {/* Step 2: Instrucciones de Pago */}
                {step === "payment" && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Instrucciones de Pago</DialogTitle>
                            <DialogDescription>
                                Realiza la transferencia bancaria con los siguientes datos
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {/* Resumen del plan */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Plan seleccionado</p>
                                        <p className="text-lg font-bold text-gray-900">{selectedPlanInfo.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Monto a pagar</p>
                                        <p className="text-2xl font-bold text-amber-600">
                                            ${selectedPlanInfo.price}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Datos bancarios */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                                <div className="flex items-center gap-2 mb-3">
                                    <CreditCard className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-semibold text-gray-900">Datos para la transferencia</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <div>
                                            <p className="text-xs text-gray-500">Banco</p>
                                            <p className="font-semibold text-gray-900">{BANK_ACCOUNT_INFO.bank}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleCopy(BANK_ACCOUNT_INFO.bank, "bank")}
                                        >
                                            {copiedField === "bank" ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <div>
                                            <p className="text-xs text-gray-500">Número de cuenta</p>
                                            <p className="font-semibold text-gray-900">{BANK_ACCOUNT_INFO.accountNumber}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleCopy(BANK_ACCOUNT_INFO.accountNumber, "account")}
                                        >
                                            {copiedField === "account" ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <div>
                                            <p className="text-xs text-gray-500">Tipo de cuenta</p>
                                            <p className="font-semibold text-gray-900">{BANK_ACCOUNT_INFO.accountType}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <div>
                                            <p className="text-xs text-gray-500">Titular</p>
                                            <p className="font-semibold text-gray-900">{BANK_ACCOUNT_INFO.holder}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleCopy(BANK_ACCOUNT_INFO.holder, "holder")}
                                        >
                                            {copiedField === "holder" ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <div>
                                            <p className="text-xs text-gray-500">RUT</p>
                                            <p className="font-semibold text-gray-900">{BANK_ACCOUNT_INFO.rut}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleCopy(BANK_ACCOUNT_INFO.rut, "rut")}
                                        >
                                            {copiedField === "rut" ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Instrucciones adicionales */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                    <div className="text-sm text-yellow-900">
                                        <p className="font-semibold mb-2">Instrucciones:</p>
                                        <ol className="list-decimal list-inside space-y-1">
                                            <li>Realiza la transferencia por el monto exacto</li>
                                            <li>Guarda el comprobante de pago</li>
                                            <li>Completa el formulario en el siguiente paso</li>
                                            <li>Enviarás la información por WhatsApp con tu comprobante</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Información de contacto WhatsApp */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex gap-3 items-start">
                                    <svg className="w-6 h-6 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-green-900 mb-1">
                                            📱 Envío por WhatsApp
                                        </p>
                                        <p className="text-sm text-green-800">
                                            En el siguiente paso podrás enviar tu comprobante directamente por WhatsApp al número:
                                        </p>
                                        <p className="text-sm font-bold text-green-900 mt-1">
                                            {CONTACT_CONFIG.whatsapp.displayNumber}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setStep("select")}>
                                Volver
                            </Button>
                            <Button
                                onClick={() => setStep("proof")}
                                className="bg-amber-500 hover:bg-amber-600 text-white"
                            >
                                Ya realicé la transferencia
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {/* Step 3: Cargar Comprobante */}
                {step === "proof" && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                Confirmar Pago
                                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </DialogTitle>
                            <DialogDescription>
                                Ingresa los datos de tu transferencia. Se enviará la información por WhatsApp junto con tu comprobante.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="reference">Número de referencia / Comprobante *</Label>
                                <Input
                                    id="reference"
                                    placeholder="Ej: 123456789"
                                    value={transactionReference}
                                    onChange={(e) => setTransactionReference(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    Ingresa el número de referencia que aparece en tu comprobante bancario
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Fecha de la transferencia *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={transactionDate}
                                    onChange={(e) => setTransactionDate(e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-sm font-semibold text-gray-900 mb-2">Resumen del pago:</p>
                                <div className="space-y-1 text-sm text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Plan:</span>
                                        <span className="font-semibold">{selectedPlanInfo.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Monto:</span>
                                        <span className="font-semibold">${selectedPlanInfo.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Duración:</span>
                                        <span className="font-semibold">{selectedPlanInfo.duration}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex gap-2">
                                    <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    <div className="text-sm text-green-900">
                                        <p className="font-semibold mb-1">📱 Envío por WhatsApp</p>
                                        <p>
                                            Al hacer clic en "Enviar por WhatsApp", se abrirá una conversación
                                            con toda la información ya completada. Solo debes adjuntar la foto
                                            de tu comprobante y enviar el mensaje.
                                        </p>
                                        <p className="mt-2 text-xs">
                                            ⏱️ Tiempo de verificación: 24-48 horas hábiles
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setStep("payment")}>
                                Volver
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!transactionReference || !transactionDate || isSubmitting}
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                {isSubmitting ? "Abriendo WhatsApp..." : "Enviar por WhatsApp"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default RenewalModal;
