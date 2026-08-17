// clientRegistrationSchema.ts
import { z } from 'zod';
import { isValidCpf, normalizeCpf } from '../utils/cpf';

export const clientRegistrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .refine(
      (value) => value.split(/\s+/).filter(Boolean).length >= 2,
      'Informe nome e sobrenome.',
    ),
  cpf: z
    .string()
    .transform(normalizeCpf)
    .refine(isValidCpf, 'Informe um CPF válido.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Informe um e-mail válido.'),
  favoriteColorId: z
    .string()
    .trim()
    .min(1, 'Selecione a cor preferida.'),
  observations: z
    .string()
    .trim()
    .max(5000, 'As observações devem ter no máximo 5000 caracteres.')
    .transform((value) => (value.length > 0 ? value : undefined))
    .optional(),
});

export type ClientRegistrationFormData = z.infer<
  typeof clientRegistrationSchema
>;
