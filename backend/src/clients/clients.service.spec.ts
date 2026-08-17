// clients.service.spec.ts
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ClientsRepository } from './clients.repository';
import { ClientsService } from './clients.service';

const createClientData = {
  fullName: 'John Doe',
  cpf: '52998224725',
  email: 'john@email.com',
  favoriteColorId: '550e8400-e29b-41d4-a716-446655440000',
  observations: 'Observação opcional',
};

const activeColor = {
  id: createClientData.favoriteColorId,
  name: 'Azul',
  value: 'blue',
  hex: '#0000FF',
  isActive: true,
};

describe('ClientsService', () => {
  let clientsRepository: jest.Mocked<
    Pick<ClientsRepository, 'findActiveColorById' | 'create'>
  >;
  let clientsService: ClientsService;

  beforeEach(() => {
    clientsRepository = {
      findActiveColorById: jest.fn(),
      create: jest.fn(),
    };
    clientsService = new ClientsService(
      clientsRepository as unknown as ClientsRepository,
    );
  });

  it('cadastra cliente válido', async () => {
    clientsRepository.findActiveColorById.mockResolvedValue(activeColor);
    clientsRepository.create.mockResolvedValue({
      id: 'client-id',
      createdAt: new Date('2026-08-16T00:00:00.000Z'),
      ...createClientData,
    });

    await expect(
      clientsService.create(createClientData),
    ).resolves.toBeUndefined();

    expect(clientsRepository.findActiveColorById).toHaveBeenCalledWith(
      createClientData.favoriteColorId,
    );
    expect(clientsRepository.create).toHaveBeenCalledWith(createClientData);
  });

  it('rejeita favoriteColorId inexistente ou inativo', async () => {
    clientsRepository.findActiveColorById.mockResolvedValue(null);

    await expect(
      clientsService.create(createClientData),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(clientsRepository.create).not.toHaveBeenCalled();
  });

  it('trata CPF duplicado', async () => {
    clientsRepository.findActiveColorById.mockResolvedValue(activeColor);
    clientsRepository.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '7.9.1',
        meta: { target: ['cpf'] },
      }),
    );

    await expect(
      clientsService.create(createClientData),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('trata CPF duplicado retornado pelo driver adapter', async () => {
    clientsRepository.findActiveColorById.mockResolvedValue(activeColor);
    clientsRepository.create.mockRejectedValue({
      code: 'P2002',
      meta: {
        driverAdapterError: {
          cause: {
            constraint: {
              fields: ['cpf'],
            },
          },
        },
      },
    });

    await expect(
      clientsService.create(createClientData),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('trata erro inesperado', async () => {
    clientsRepository.findActiveColorById.mockResolvedValue(activeColor);
    clientsRepository.create.mockRejectedValue(new Error('database offline'));

    await expect(
      clientsService.create(createClientData),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
