// clients.schema.ts
import { z } from 'zod';
import { isValidCpf, normalizeCpf } from './cpf';

const requiredTrimmedString = (message: string) =>
  z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, { message });

export const createClientSchema = z.object({
  fullName: requiredTrimmedString('Informe o nome completo.'),
  cpf: z
    .string()
    .transform(normalizeCpf)
    .refine(isValidCpf, { message: 'Informe um CPF válido.' }),
  email: z
    .string()
    .transform((value) => value.trim().toLowerCase())
    .pipe(z.email({ message: 'Informe um e-mail válido.' })),
  favoriteColorId: requiredTrimmedString('Informe a cor preferida.').pipe(
    z.uuid({ message: 'Informe uma cor válida.' }),
  ),
  observations: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length <= 5000, {
      message: 'As observações devem ter no máximo 5000 caracteres.',
    })
    .optional(),
});

export type CreateClientInput = z.input<typeof createClientSchema>;
export type CreateClientData = z.output<typeof createClientSchema>;
