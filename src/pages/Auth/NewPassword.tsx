import PasswordStrength from '@/components/auth/PasswordStrength';
import { LockIcon, } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { SendEmailForm, SendNewPasswordForm } from './PasswordReset';
import ErrorMessage from '@/components/Error/Message';

interface NewPasswordProps {
    register: UseFormRegister<SendEmailForm | SendNewPasswordForm>;
    token: string;
    errors: FieldErrors<SendNewPasswordForm>;
}
const NewPassword = ({ register, token, errors }: NewPasswordProps) => {
    const [passwordSelected, setPasswordSelected] = useState<string>("");
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
            >
                <label htmlFor="token" className="block text-zinc-200 font-semibold text-sm">
                    Token
                </label>
                <div className="relative group">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 sm:w-12 text-zinc-500 group-focus-within:text-blue-400 transition-colors">
                        <LockIcon className="size-4 sm:size-5" aria-hidden="true" />
                    </div>
                    <ErrorMessage>
                        {errors.token && errors.token.message}
                    </ErrorMessage>
                    <input
                        {...register("token")}
                        required
                        defaultValue={token ?? ''}
                        minLength={6}
                        maxLength={30}
                        aria-label="Token"
                        autoSave="token"
                        autoComplete="token"
                        type="text"
                        id="token"
                        name="token"
                        className="text-sm sm:text-base placeholder-zinc-500 text-white pl-10 sm:pl-12 pr-4 rounded-lg border-2 border-zinc-700/50 bg-zinc-800/50 w-full py-3 sm:py-3.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-zinc-600"
                        placeholder="Tu token"
                    />
                </div>
            </motion.div>
            {/* Password field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
            >
                <label htmlFor="newPassword" className="block text-zinc-200 font-semibold text-sm">
                    Nueva Contraseña
                </label>
                <div className="relative group">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 sm:w-12 text-zinc-500 group-focus-within:text-blue-400 transition-colors">
                        <LockIcon className="size-4 sm:size-5" aria-hidden="true" />
                    </div>
                    <ErrorMessage>
                        {errors.newPassword && errors.newPassword.message}
                    </ErrorMessage>
                    <input
                        {...register("newPassword")}
                        onChange={e => setPasswordSelected(e.target.value)}
                        required
                        minLength={6}
                        maxLength={20}
                        aria-label="Contraseña"
                        autoSave="new-password"
                        autoComplete="new-password"
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className="text-sm sm:text-base placeholder-zinc-500 text-white pl-10 sm:pl-12 pr-4 rounded-lg border-2 border-zinc-700/50 bg-zinc-800/50 w-full py-3 sm:py-3.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-zinc-600"
                        placeholder="Tu contraseña"
                    />
                </div>
            </motion.div>
            {/* Password field */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
            >
                <label htmlFor="confirmNewPassword" className="block text-zinc-200 font-semibold text-sm">
                    Confirmar Nueva Contraseña
                </label>
                <div className="relative group">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 sm:w-12 text-zinc-500 group-focus-within:text-blue-400 transition-colors">
                        <LockIcon className="size-4 sm:size-5" aria-hidden="true" />
                    </div>
                    <ErrorMessage>
                        {errors.confirmNewPassword && errors.confirmNewPassword.message}
                    </ErrorMessage>
                    <input
                        {...register("confirmNewPassword")}
                        required
                        minLength={6}
                        maxLength={20}
                        aria-label="Contraseña"
                        autoSave="current-password"
                        autoComplete="current-password"
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        className="text-sm sm:text-base placeholder-zinc-500 text-white pl-10 sm:pl-12 pr-4 rounded-lg border-2 border-zinc-700/50 bg-zinc-800/50 w-full py-3 sm:py-3.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-zinc-600"
                        placeholder="Confirmar tu contraseña"
                    />
                </div>
            </motion.div>
            <PasswordStrength passwordSelected={passwordSelected} />
        </>

    )
}

export default NewPassword