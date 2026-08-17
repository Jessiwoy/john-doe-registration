// clients.schema.spec.ts
import { describe, expect, it } from '@jest/globals';
import { createClientSchema } from './clients.schema';
import { isValidCpf, normalizeCpf } from './cpf';

const validPayload = {
  fullName: ' John Doe ',
  cpf: '529.982.247-25',
  email: ' JOHN@EMAIL.COM ',
  favoriteColorId: '550e8400-e29b-41d4-a716-446655440000',
  observations: ' Observação opcional ',
};

describe('createClientSchema', () => {
  it('normaliza payload com nome e sobrenome válidos', () => {
    const result = createClientSchema.parse(validPayload);

    expect(result).toEqual({
      fullName: 'John Doe',
      cpf: '52998224725',
      email: 'john@email.com',
      favoriteColorId: '550e8400-e29b-41d4-a716-446655440000',
      observations: 'Observação opcional',
    });
  });

  it('rejeita nome vazio', () => {
    expect(() =>
      createClientSchema.parse({ ...validPayload, fullName: '' }),
    ).toThrow();
  });

  it('rejeita nome composto apenas por espaços', () => {
    expect(() =>
      createClientSchema.parse({ ...validPayload, fullName: '   ' }),
    ).toThrow();
  });

  it('rejeita nome com apenas uma palavra', () => {
    expect(() =>
      createClientSchema.parse({ ...validPayload, fullName: 'John' }),
    ).toThrow();
  });

  it('rejeita CPF inválido', () => {
    expect(() =>
      createClientSchema.parse({ ...validPayload, cpf: '111.111.111-11' }),
    ).toThrow();
  });

  it('rejeita e-mail inválido', () => {
    expect(() =>
      createClientSchema.parse({ ...validPayload, email: 'email-invalido' }),
    ).toThrow();
  });

  it('rejeita favoriteColorId ausente', () => {
    const { favoriteColorId, ...payload } = validPayload;

    expect(favoriteColorId).toBeDefined();
    expect(() => createClientSchema.parse(payload)).toThrow();
  });

  it('rejeita favoriteColorId inválido', () => {
    expect(() =>
      createClientSchema.parse({
        ...validPayload,
        favoriteColorId: 'cor-azul',
      }),
    ).toThrow();
  });

  it('aceita observações ausentes', () => {
    const { observations, ...payload } = validPayload;

    expect(observations).toBeDefined();
    expect(createClientSchema.parse(payload).observations).toBeUndefined();
  });

  it('rejeita observações acima de 5000 caracteres', () => {
    expect(() =>
      createClientSchema.parse({
        ...validPayload,
        observations: 'a'.repeat(5001),
      }),
    ).toThrow();
  });
});

describe('CPF validation', () => {
  it('remove máscara do CPF', () => {
    expect(normalizeCpf('529.982.247-25')).toBe('52998224725');
  });

  it('valida dígitos verificadores do CPF', () => {
    expect(isValidCpf('52998224725')).toBe(true);
    expect(isValidCpf('52998224724')).toBe(false);
  });

  it('preserva zeros à esquerda durante a normalização', () => {
    expect(normalizeCpf('012.345.678-90')).toBe('01234567890');
  });
});
