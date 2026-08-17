// cpf.ts
export function normalizeCpf(cpf: string) {
  return cpf.replace(/\D/g, '');
}

export function formatCpf(value: string) {
  return normalizeCpf(value)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

export function isValidCpf(cpf: string) {
  const normalizedCpf = normalizeCpf(cpf);

  if (normalizedCpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(normalizedCpf)) {
    return false;
  }

  const digits = normalizedCpf.split('').map(Number);
  const firstDigit = calculateVerifierDigit(digits.slice(0, 9), 10);
  const secondDigit = calculateVerifierDigit(digits.slice(0, 10), 11);

  return firstDigit === digits[9] && secondDigit === digits[10];
}

function calculateVerifierDigit(digits: number[], factor: number) {
  const total = digits.reduce((sum, digit) => {
    const result = sum + digit * factor;
    factor -= 1;

    return result;
  }, 0);
  const remainder = (total * 10) % 11;

  return remainder === 10 ? 0 : remainder;
}
