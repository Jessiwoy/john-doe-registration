// cpf.ts
export function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

export function isValidCpf(cpf: string): boolean {
  const normalizedCpf = normalizeCpf(cpf);

  if (normalizedCpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(normalizedCpf)) {
    return false;
  }

  const digits = normalizedCpf.split('').map(Number);
  const firstVerifier = calculateVerifierDigit(digits.slice(0, 9));
  const secondVerifier = calculateVerifierDigit(digits.slice(0, 10));

  return digits[9] === firstVerifier && digits[10] === secondVerifier;
}

function calculateVerifierDigit(digits: number[]): number {
  const initialWeight = digits.length + 1;
  const sum = digits.reduce((total, digit, index) => {
    return total + digit * (initialWeight - index);
  }, 0);
  const remainder = (sum * 10) % 11;

  return remainder === 10 ? 0 : remainder;
}
