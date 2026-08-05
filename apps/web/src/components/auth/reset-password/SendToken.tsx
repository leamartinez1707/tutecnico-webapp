import ErrorMessage from '@/components/Error/Message';
import { SendEmailForm, SendNewPasswordForm } from '@/pages/Auth/PasswordReset';
import { Mail } from 'lucide-react'
import { motion } from 'motion/react'
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface SendTokenProps {
    register: UseFormRegister<SendEmailForm | SendNewPasswordForm>;
    errors: FieldErrors<SendEmailForm>;
}
const SendToken = ({ register, errors }: SendTokenProps) => {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
            >
                <label htmlFor="email" className="block text-zinc-200 font-semibold text-sm">
                    Tu email
                </label>
                <ErrorMessage>
                    {errors.email && errors.email.message}
                </ErrorMessage>
                <div className="relative group">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 sm:w-12 text-zinc-500 group-focus-within:text-blue-400 transition-colors">
                        <Mail className="size-4 sm:size-5" aria-hidden="true" />
                    </div>
                    <input
                        {...register("email")}
                        aria-label="Tu email"
                        autoSave="email"
                        autoFocus
                        autoComplete="email"
                        required

                        type="email"
                        id="email"
                        name="email"
                        className="text-sm sm:text-base placeholder-zinc-500 text-white pl-10 sm:pl-12 pr-4 rounded-lg border-2 border-zinc-700/50 bg-zinc-800/50 w-full py-3 sm:py-3.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-zinc-600"
                        placeholder="Ej: correo@ejemplo.com"
                    />
                </div>
            </motion.div>
        </>
    )
}

export default SendToken