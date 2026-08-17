// clients.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { CreateClientData } from './clients.schema';

type PrismaKnownError = {
  code?: string;
  meta?: {
    target?: unknown;
    driverAdapterError?: {
      cause?: {
        constraint?: {
          fields?: unknown;
        };
      };
    };
  };
};

@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async create(data: CreateClientData): Promise<void> {
    const favoriteColor = await this.clientsRepository.findActiveColorById(
      data.favoriteColorId,
    );

    if (!favoriteColor) {
      throw new BadRequestException('Dados inválidos.');
    }

    try {
      await this.clientsRepository.create(data);
    } catch (error) {
      if (this.isUniqueCpfError(error)) {
        throw new ConflictException('Cliente já cadastrado.');
      }

      throw new InternalServerErrorException('Erro inesperado.');
    }
  }

  private isUniqueCpfError(error: unknown): boolean {
    if (!this.isPrismaKnownError(error)) {
      return false;
    }

    return error.code === 'P2002' && this.hasCpfConstraintTarget(error);
  }

  private isPrismaKnownError(error: unknown): error is PrismaKnownError {
    return typeof error === 'object' && error !== null && 'code' in error;
  }

  private hasCpfConstraintTarget(error: PrismaKnownError): boolean {
    const target = error.meta?.target;
    const adapterFields =
      error.meta?.driverAdapterError?.cause?.constraint?.fields;

    return (
      (Array.isArray(target) && target.includes('cpf')) ||
      (typeof target === 'string' && target.includes('cpf')) ||
      (Array.isArray(adapterFields) && adapterFields.includes('cpf'))
    );
  }
}
