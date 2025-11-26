import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string()
        .email('Email inválido')
        .min(5, 'Email debe tener al menos 5 caracteres')
        .max(100, 'Email demasiado largo')
        .regex(/@(alumno\.iaev\.mx|iaev\.mx)$/, 'Debe usar email institucional (@iaev.mx o @alumno.iaev.mx)'),

    password: z.string()
        .min(8, 'Contraseña debe tener al menos 8 caracteres')
        .max(50, 'Contraseña demasiado larga'),

    name: z.string()
        .min(2, 'Nombre debe tener al menos 2 caracteres')
        .max(100, 'Nombre demasiado largo')
        .optional()
});

export const sanitizeInput = (input: string): string => {
    return input
        .trim()
        .replace(/[<>]/g, '') // Prevenir XSS básico
        .substring(0, 500); // Límite de longitud
};
