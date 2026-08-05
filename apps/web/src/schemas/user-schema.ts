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
export const uruguayanPhoneRegex = /^(\+?598\s?)?0?9[1-9]\s?(\d{3}\s?\d{3}|\d{6})$/;

export const contactDataSchema = z.object({
    email: z
        .email('El email no es válido')
        .min(1, 'El email es obligatorio'),
    phone: z.string()
        .min(8, 'El teléfono debe tener al menos 8 caracteres')
        .regex(uruguayanPhoneRegex, 'El teléfono debe ser un número uruguayo válido (ej: 099 123 456)'),
    address: z.string()
        .min(8, 'La dirección debe tener al menos 8 caracteres')
});

export type ContactDataFormSchema = z.infer<typeof contactDataSchema>;
