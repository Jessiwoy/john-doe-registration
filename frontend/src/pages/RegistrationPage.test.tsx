// RegistrationPage.test.tsx
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RegistrationPage from './RegistrationPage';
import { createClient, getColors } from '../services/registrationService';

vi.mock('../services/registrationService', () => ({
  createClient: vi.fn(),
  getColors: vi.fn(),
}));

const colors = [
  {
    id: 'color-blue-id',
    name: 'Azul',
    value: 'blue',
    hex: '#0000FF',
  },
  {
    id: 'color-red-id',
    name: 'Vermelho',
    value: 'red',
    hex: '#FF0000',
  },
];

describe('RegistrationPage', () => {
  beforeEach(() => {
    vi.mocked(getColors).mockResolvedValue(colors);
    vi.mocked(createClient).mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  async function renderRegistrationPage() {
    render(<RegistrationPage />);

    await screen.findByRole('option', { name: 'Azul' });
  }

  it('carrega as cores e exibe o nome para o usuário', async () => {
    await renderRegistrationPage();

    expect(getColors).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('option', { name: 'Azul' })).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Vermelho' }),
    ).toBeInTheDocument();
  });

  it('mostra erro quando não consegue carregar as cores', async () => {
    vi.mocked(getColors).mockRejectedValue(new Error('api offline'));

    render(<RegistrationPage />);

    expect(
      await screen.findByText('Não foi possível carregar as cores.'),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Enviar cadastro' })).toBeDisabled();
  });

  it('mostra mensagens de validação ao enviar vazio', async () => {
    const user = userEvent.setup();
    await renderRegistrationPage();

    await user.click(screen.getByRole('button', { name: 'Enviar cadastro' }));

    expect(await screen.findByText('Informe nome e sobrenome.')).toBeVisible();
    expect(screen.getByText('Informe um CPF válido.')).toBeVisible();
    expect(screen.getByText('Informe um e-mail válido.')).toBeVisible();
    expect(screen.getByText('Selecione a cor preferida.')).toBeVisible();
    expect(createClient).not.toHaveBeenCalled();
  });

  it('rejeita nome sem sobrenome', async () => {
    const user = userEvent.setup();
    await renderRegistrationPage();

    await user.type(screen.getByLabelText(/nome completo/i), 'John');
    await user.type(screen.getByLabelText(/cpf/i), '52998224725');
    await user.type(screen.getByLabelText(/e-mail/i), 'john@email.com');
    await user.selectOptions(
      screen.getByLabelText(/cor preferida/i),
      'color-blue-id',
    );
    await user.click(screen.getByRole('button', { name: 'Enviar cadastro' }));

    expect(await screen.findByText('Informe nome e sobrenome.')).toBeVisible();
    expect(createClient).not.toHaveBeenCalled();
  });

  it('aplica máscara de CPF durante a digitação', async () => {
    const user = userEvent.setup();
    await renderRegistrationPage();
    const cpfInput = screen.getByLabelText(/cpf/i);

    await user.type(cpfInput, '52998224725');

    expect(cpfInput).toHaveValue('529.982.247-25');
  });

  it('envia favoriteColorId no payload do cadastro', async () => {
    const user = userEvent.setup();
    await renderRegistrationPage();

    await user.type(screen.getByLabelText(/nome completo/i), 'John Doe');
    await user.type(screen.getByLabelText(/cpf/i), '52998224725');
    await user.type(screen.getByLabelText(/e-mail/i), 'JOHN@EMAIL.COM');
    await user.selectOptions(
      screen.getByLabelText(/cor preferida/i),
      'color-blue-id',
    );
    await user.type(
      screen.getByLabelText(/observações/i),
      ' Observação opcional ',
    );
    await user.click(screen.getByRole('button', { name: 'Enviar cadastro' }));

    await waitFor(() => {
      expect(createClient).toHaveBeenCalledWith({
        fullName: 'John Doe',
        cpf: '52998224725',
        email: 'john@email.com',
        favoriteColorId: 'color-blue-id',
        observations: 'Observação opcional',
      });
    });
    expect(
      await screen.findByText('Cadastro realizado com sucesso.'),
    ).toBeVisible();
  });

  it('mostra feedback específico para CPF duplicado', async () => {
    const user = userEvent.setup();
    vi.mocked(createClient).mockRejectedValue({
      isAxiosError: true,
      response: { status: 409 },
    });
    await renderRegistrationPage();

    await user.type(screen.getByLabelText(/nome completo/i), 'John Doe');
    await user.type(screen.getByLabelText(/cpf/i), '52998224725');
    await user.type(screen.getByLabelText(/e-mail/i), 'john@email.com');
    await user.selectOptions(
      screen.getByLabelText(/cor preferida/i),
      'color-blue-id',
    );
    await user.click(screen.getByRole('button', { name: 'Enviar cadastro' }));

    expect(
      await screen.findByText('Este cliente já possui cadastro.'),
    ).toBeVisible();
  });

  it('mostra feedback de revisão para dados rejeitados pela API', async () => {
    const user = userEvent.setup();
    vi.mocked(createClient).mockRejectedValue({
      isAxiosError: true,
      response: { status: 400 },
    });
    await renderRegistrationPage();

    await user.type(screen.getByLabelText(/nome completo/i), 'John Doe');
    await user.type(screen.getByLabelText(/cpf/i), '52998224725');
    await user.type(screen.getByLabelText(/e-mail/i), 'john@email.com');
    await user.selectOptions(
      screen.getByLabelText(/cor preferida/i),
      'color-blue-id',
    );
    await user.click(screen.getByRole('button', { name: 'Enviar cadastro' }));

    expect(await screen.findByText('Revise os dados informados.')).toBeVisible();
  });

  it('mostra feedback genérico quando a API falha', async () => {
    const user = userEvent.setup();
    vi.mocked(createClient).mockRejectedValue(new Error('api offline'));
    await renderRegistrationPage();

    await user.type(screen.getByLabelText(/nome completo/i), 'John Doe');
    await user.type(screen.getByLabelText(/cpf/i), '52998224725');
    await user.type(screen.getByLabelText(/e-mail/i), 'john@email.com');
    await user.selectOptions(
      screen.getByLabelText(/cor preferida/i),
      'color-blue-id',
    );
    await user.click(screen.getByRole('button', { name: 'Enviar cadastro' }));

    expect(
      await screen.findByText(
        'Não foi possível realizar o cadastro. Tente novamente.',
      ),
    ).toBeVisible();
  });
});
