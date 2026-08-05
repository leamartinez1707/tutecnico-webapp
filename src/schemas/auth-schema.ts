import { z } from 'zod'

/**
 * Validación para teléfonos uruguayos
 * Formatos aceptados:
 * - 099123456 (sin separadores)
 * - 099 123 456 (con espacios)
 * - 099-123-456 (con guiones)
 * - +598 99 123 456 (con código de país)
 * - +59899123456 (con código de país sin espacios)
 */
const uruguayanPhoneRegex = /^(\+?598\s?)?0?9[1-9]\s?(\d{3}\s?\d{3}|\d{6})$/;

export const signUpSchema = z.object({
    firstName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    lastName: z.string().min(3, 'El apellido debe tener al menos 3 caracteres'),
    email: z.string().email('El email no es válido'),
    phone: z.string()
        .min(8, 'El teléfono debe tener al menos 8 caracteres')
        .regex(uruguayanPhoneRegex, 'El teléfono debe ser un número uruguayo válido (ej: 099 123 456)'),
    services: z.array(z.string()).nonempty('Debes seleccionar al menos un servicio'),
    specialization: z.string().min(6, 'La especialización debe tener al menos 6 caracteres'),
    address: z.string().min(8, 'La dirección debe tener al menos 8 caracteres'),
    username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirm_password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
}).refine(
    (values) => {
        return values.password === values.confirm_password;
    },
    {
        message: "Las contraseñas deben coincidir",
        path: ["confirm_password"],
    }
);

export const signUpUserSchema = signUpSchema.omit({
    services: true,
    specialization: true
});

export const signInSchema = z.object({
    username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

export const sendResetEmailSchema = z.object({
    email: z.email('El email no es válido')
});
export const sendNewPasswordSchema = z.object({
    token: z.string().min(1, 'El token es obligatorio'),
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
    confirmNewPassword: z.string().min(8, 'La confirmación de la nueva contraseña debe tener al menos 8 caracteres')
}).refine(
    (values) => {
        return values.newPassword === values.confirmNewPassword;
    },
    {
        message: "Las contraseñas deben coincidir",
        path: ["confirmNewPassword"],
    }
);