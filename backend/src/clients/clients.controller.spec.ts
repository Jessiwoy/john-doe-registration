// clients.controller.spec.ts
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

const payload = {
  fullName: ' John Doe ',
  cpf: '529.982.247-25',
  email: ' JOHN@EMAIL.COM ',
  favoriteColorId: '550e8400-e29b-41d4-a716-446655440000',
  observations: ' Observação opcional ',
};

describe('ClientsController', () => {
  let clientsService: jest.Mocked<Pick<ClientsService, 'create'>>;
  let clientsController: ClientsController;

  beforeEach(() => {
    clientsService = {
      create: jest.fn(),
    };
    clientsController = new ClientsController(
      clientsService as unknown as ClientsService,
    );
  });

  it('retorna mensagem de sucesso ao cadastrar cliente', async () => {
    clientsService.create.mockResolvedValue(undefined);

    await expect(clientsController.create(payload)).resolves.toEqual({
      message: 'Cliente cadastrado com sucesso.',
    });
    expect(clientsService.create).toHaveBeenCalledWith({
      fullName: 'John Doe',
      cpf: '52998224725',
      email: 'john@email.com',
      favoriteColorId: '550e8400-e29b-41d4-a716-446655440000',
      observations: 'Observação opcional',
    });
  });

  it('retorna BadRequest para payload inválido', async () => {
    await expect(
      clientsController.create({ ...payload, cpf: '111.111.111-11' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(clientsService.create).not.toHaveBeenCalled();
  });
});
