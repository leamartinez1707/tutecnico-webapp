import { useEffect, useState, useCallback, useMemo } from "react"
import { confirmNewPasswordRequest, resetPasswordRequest } from "@/api/authApi"
import RateLimitWarning from "@/components/ui/RateLimitWarning"
import { appInfo } from "@/const/appInfo"
import { Mail } from "lucide-react"
import { motion } from "motion/react"
import { enqueueSnackbar } from "notistack"
import SendToken from "@/components/auth/reset-password/SendToken"
import NewPassword from "./NewPassword"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendNewPasswordSchema, sendResetEmailSchema } from "@/schemas/auth-schema"
import { logger } from "@/utils/logger"
import type { z } from "zod"

// Type-safe form types derived from schemas
export type SendEmailForm = z.infer<typeof sendResetEmailSchema>;
export type SendNewPasswordForm = z.infer<typeof sendNewPasswordSchema>;

// Union type for the form
export type PasswordResetForm = SendEmailForm | SendNewPasswordForm;

// Type guards
const isNewPasswordForm = (data: PasswordResetForm): data is SendNewPasswordForm => {
    return 'newPassword' in data && 'confirmNewPassword' in data;
};

const isEmailForm = (data: PasswordResetForm): data is SendEmailForm => {
    return 'email' in data;
};

const PasswordReset = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Extraer token de forma segura y memoizada
    const token = useMemo(() => searchParams.get("token"), [searchParams]);
    
    const [withToken, setWithToken] = useState<boolean>(!!token);
    const [passwordConfirmed, setPasswordConfirmed] = useState<boolean>(false);
    
    // Seleccionar schema dinámicamente
    const selectedSchema = useMemo(
        () => withToken ? sendNewPasswordSchema : sendResetEmailSchema,
        [withToken]
    );
    
    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<PasswordResetForm>({
        resolver: zodResolver(selectedSchema),
        mode: 'onBlur', // Validar en blur para mejor UX
        defaultValues: {
            email: '',
            token: token ?? '',
            newPassword: '',
            confirmNewPassword: '',
        }
    });

    // Sincronizar token cuando cambia la URL
    useEffect(() => {
        if (token && withToken) {
            setValue('token', token, { shouldValidate: true });
        }
    }, [token, withToken, setValue]);

    // Handler para resetear contraseña con nuevo password
    const handleConfirmNewPassword = useCallback(async (data: SendNewPasswordForm) => {
        const tokenToUse = token || data.token;
        
        if (!tokenToUse) {
            logger.error('Token no encontrado en confirmación de contraseña');
            enqueueSnackbar('Token no encontrado. Por favor, solicita un nuevo enlace de restablecimiento.', { variant: 'error' });
            return;
        }

        logger.info('Confirmando nueva contraseña');
        const response = await confirmNewPasswordRequest(tokenToUse, data.newPassword);
        
        if (response) {
            logger.info('Contraseña restablecida exitosamente');
            enqueueSnackbar('Tu contraseña ha sido restablecida con éxito. Ahora podés iniciar sesión con tu nueva contraseña.', { variant: 'success' });
            setPasswordConfirmed(true);
            reset();
            // Redirigir después de un delay para que el usuario vea el mensaje
            setTimeout(() => navigate('/login'), 1500);
        }
    }, [token, navigate, reset]);

    // Handler para solicitar email de reseteo
    const handleRequestResetEmail = useCallback(async (data: SendEmailForm) => {
        logger.info('Solicitando reseteo de contraseña', { email: data.email });
        const response = await resetPasswordRequest(data.email);
        
        if (response) {
            logger.info('Email de reseteo enviado exitosamente');
            // Mensaje genérico por seguridad (no revelar si el email existe)
            enqueueSnackbar('Si el email ingresado está registrado, recibirás un correo con instrucciones para restablecer tu contraseña.', { variant: 'success' });
            reset();
            setWithToken(true);
        }
    }, [reset]);

    // Handler principal que delega según el tipo de formulario
    const onSubmit = useCallback(async (formData: PasswordResetForm) => {
        try {
            if (withToken && isNewPasswordForm(formData)) {
                await handleConfirmNewPassword(formData);
            } else if (!withToken && isEmailForm(formData)) {
                await handleRequestResetEmail(formData);
            } else {
                logger.error('Estado inválido del formulario', { withToken, formData });
                enqueueSnackbar('Error en el formulario. Por favor, recarga la página.', { variant: 'error' });
            }
        } catch (error: unknown) {
            logger.error('Error en proceso de reseteo de contraseña', error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Ocurrió un error al solicitar el restablecimiento de contraseña. Por favor, intentá nuevamente más tarde.';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }, [withToken, handleConfirmNewPassword, handleRequestResetEmail]);

    // Determinar texto del botón
    const buttonText = useMemo(() => {
        if (passwordConfirmed) return 'Redirigiendo...';
        return withToken ? 'Restablecer contraseña' : 'Solicitar restablecimiento';
    }, [withToken, passwordConfirmed]);

    // Actualizar título de la página
    useEffect(() => {
        document.title = `Restablecer contraseña - ${appInfo.name}`;
    }, []);

    return (
        <div className="relative flex flex-col w-full justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-linear-to-b from-black via-zinc-900 to-black overflow-hidden">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 rounded-2xl bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 shadow-2xl overflow-hidden w-full max-w-md mx-auto"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="px-6 sm:px-8 py-8 sm:py-10 text-center relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-transparent to-emerald-600/10" />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="flex flex-col items-center justify-center mb-4 sm:mb-6"
                        >
                            <div className="bg-linear-to-br from-blue-600 to-emerald-600 rounded-2xl p-4 sm:p-5 mb-3 sm:mb-4">
                                <Mail className="h-7 w-7 sm:h-9 sm:w-9 text-white" aria-hidden="true" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white text-center">¡Restablece tu contraseña!</h1>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-zinc-300 text-base sm:text-lg"
                        >
                            Restablecé tu contraseña en <span className="bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent font-semibold">{appInfo.name}</span>
                        </motion.p>
                    </div>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full p-6 sm:p-8 space-y-6"
                >
                    {/* Rate Limit Warning */}
                    <RateLimitWarning endpoint="/auth/password-reset" />

                    {!withToken ? <SendToken register={register} errors={errors} /> : <NewPassword errors={errors} token={token ?? ""} register={register} />}


                    <motion.button
                        disabled={isSubmitting || passwordConfirmed}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        type="submit"
                        aria-label={buttonText}
                        aria-busy={isSubmitting}
                        className="w-full bg-linear-to-r from-blue-600 to-emerald-600 text-white font-bold py-3 sm:py-4 px-6 rounded-lg hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg shadow-blue-500/20 text-sm sm:text-base disabled:bg-gray-600/70"
                    >
                        {isSubmitting ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="text-lg"
                            >
                                ⏳
                            </motion.div>
                        ) : (
                            <span className="text-lg">{buttonText}</span>
                        )}
                    </motion.button>
                </motion.form>
            </motion.div>
        </div >
    )
}

export default PasswordReset