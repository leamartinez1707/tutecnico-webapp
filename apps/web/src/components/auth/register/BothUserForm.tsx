import { useState } from 'react';
import ErrorMessage from '@/components/Error/Message'
import { SignUp, SignUpUser } from '@/types';
import { LockIcon, Mail, MapPinIcon, Phone, User2 } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { formStyles } from './formStyles';
import PasswordStrength from '../PasswordStrength';

type BothUserFormProps = {
    register: UseFormRegister<SignUp | SignUpUser>;
    errors: FieldErrors<SignUp | SignUpUser>;
}

const BothUserForm = ({ register, errors }: BothUserFormProps) => {
    const [passwordSelected, setPasswordSelected] = useState<string>('');

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="username" className={formStyles.label}>Nombre de usuario</label>
                <div className="relative group">
                    <div className={formStyles.icon}>
                        <User2 className="size-5" />
                    </div>
                    <input
                        type="text"
                        id="username"
                        className={formStyles.inputWithIcon}
                        placeholder="Ej: jose123"
                        autoComplete="off"
                        {...register("username")}
                    />
                    <ErrorMessage>
                        {errors.username && errors.username.message}
                    </ErrorMessage>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="firstName" className={formStyles.label}>Nombre</label>
                    <input
                        type="text"
                        id="firstName"
                        className={formStyles.input}
                        placeholder="José"
                        autoComplete="off"
                        {...register("firstName")}
                    />
                    <ErrorMessage>
                        {errors.firstName && errors.firstName.message}
                    </ErrorMessage>
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastName" className={formStyles.label}>Apellido</label>
                    <input
                        type="text"
                        id="lastName"
                        className={formStyles.input}
                        placeholder="Pérez"
                        autoComplete="off"
                        {...register("lastName")}
                    />
                    <ErrorMessage>
                        {errors.lastName && errors.lastName.message}
                    </ErrorMessage>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className={formStyles.label}>Correo electrónico</label>
                <div className="relative group">
                    <div className={formStyles.icon}>
                        <Mail className="size-5" />
                    </div>
                    <input
                        type="email"
                        id="email"
                        className={formStyles.inputWithIcon}
                        placeholder="ejemplo@gmail.com"
                        autoComplete="off"
                        {...register("email")}
                    />
                    <ErrorMessage>
                        {errors.email && errors.email.message}
                    </ErrorMessage>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className={formStyles.label}>Número de teléfono</label>
                <div className="relative group">
                    <div className={formStyles.icon}>
                        <Phone className="size-5" />
                    </div>
                    <input
                        type="text"
                        id="phone"
                        className={formStyles.inputWithIcon}
                        placeholder="095 123 567"
                        autoComplete="off"
                        {...register("phone")}
                    />
                    <ErrorMessage>
                        {errors.phone && errors.phone.message}
                    </ErrorMessage>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="address" className={formStyles.label}>Dirección</label>
                <div className="relative group">
                    <div className={formStyles.icon}>
                        <MapPinIcon className="size-5" />
                    </div>
                    <input
                        type="text"
                        id="address"
                        className={formStyles.inputWithIcon}
                        placeholder="Ej: 18 de Julio 1234"
                        {...register("address")}
                    />
                </div>
                <ErrorMessage>
                    {errors.address && errors.address.message}
                </ErrorMessage>
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className={formStyles.label}>Contraseña</label>
                <div className="relative group">
                    <div className={formStyles.icon}>
                        <LockIcon className="size-5" />
                    </div>
                    <input
                        type="password"
                        id="password"
                        className={formStyles.inputWithIcon}
                        autoComplete="off"
                        placeholder="Mínimo 8 caracteres"
                        {...register("password")}
                        onChange={e => setPasswordSelected(e.target.value)}
                    />
                    <ErrorMessage>
                        {errors.password && errors.password.message}
                    </ErrorMessage>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="confirm_password" className={formStyles.label}>Repetir contraseña</label>
                <div className="relative group">
                    <div className={formStyles.icon}>
                        <LockIcon className="size-5" />
                    </div>
                    <input
                        type="password"
                        id="confirm_password"
                        className={formStyles.inputWithIcon}
                        placeholder="Confirma tu contraseña"
                        autoComplete="off"
                        {...register("confirm_password")}
                    />
                    <ErrorMessage>
                        {errors.confirm_password && errors.confirm_password.message}
                    </ErrorMessage>
                </div>
            </div>
            <PasswordStrength passwordSelected={passwordSelected} />
        </div>

    )
}

export default BothUserForm