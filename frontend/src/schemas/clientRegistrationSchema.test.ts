// clientRegistrationSchema.test.ts
import { describe, expect, it } from 'vitest';
import { clientRegistrationSchema } from './clientRegistrationSchema';

const validPayload = {
  fullName: ' John Doe ',
  cpf: '529.982.247-25',
  email: ' JOHN@EMAIL.COM ',
  favoriteColorId: 'color-blue-id',
  observations: ' Observação opcional ',
};

describe('clientRegistrationSchema', () => {
  it('normaliza um payload válido', () => {
    expect(clientRegistrationSchema.parse(validPayload)).toEqual({
      fullName: 'John Doe',
      cpf: '52998224725',
      email: 'john@email.com',
      favoriteColorId: 'color-blue-id',
      observations: 'Observação opcional',
    });
  });

  it('exige nome e sobrenome', () => {
    expect(() =>
      clientRegistrationSchema.parse({ ...validPayload, fullName: 'John' }),
    ).toThrow('Informe nome e sobrenome.');
  });

  it('rejeita CPF inválido', () => {
    expect(() =>
      clientRegistrationSchema.parse({ ...validPayload, cpf: '11111111111' }),
    ).toThrow('Informe um CPF válido.');
  });

  it('rejeita e-mail inválido', () => {
    expect(() =>
      clientRegistrationSchema.parse({
        ...validPayload,
        email: 'email-invalido',
      }),
    ).toThrow('Informe um e-mail válido.');
  });

  it('exige cor preferida', () => {
    expect(() =>
      clientRegistrationSchema.parse({ ...validPayload, favoriteColorId: '' }),
    ).toThrow('Selecione a cor preferida.');
  });

  it('transforma observações vazias em undefined', () => {
    expect(
      clientRegistrationSchema.parse({
        ...validPayload,
        observations: '   ',
      }).observations,
    ).toBeUndefined();
  });

  it('rejeita observações acima de 5000 caracteres', () => {
    expect(() =>
      clientRegistrationSchema.parse({
        ...validPayload,
        observations: 'a'.repeat(5001),
      }),
    ).toThrow('As observações devem ter no máximo 5000 caracteres.');
  });
});
