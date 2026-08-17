// cpf.test.ts
import { describe, expect, it } from 'vitest';
import { formatCpf, isValidCpf, normalizeCpf } from './cpf';

describe('CPF utilities', () => {
  it('remove a máscara do CPF', () => {
    expect(normalizeCpf('529.982.247-25')).toBe('52998224725');
  });

  it('aplica máscara visual ao CPF', () => {
    expect(formatCpf('52998224725')).toBe('529.982.247-25');
  });

  it('valida os dígitos verificadores do CPF', () => {
    expect(isValidCpf('52998224725')).toBe(true);
    expect(isValidCpf('52998224724')).toBe(false);
  });

  it('rejeita sequências repetidas', () => {
    expect(isValidCpf('11111111111')).toBe(false);
  });
});
