// clients.repository.ts
import { Injectable } from '@nestjs/common';
import { Client, Color } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientData } from './clients.schema';

@Injectable()
export class ClientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveColorById(id: string): Promise<Color | null> {
    return this.prisma.color.findFirst({
      where: {
        id,
        isActive: true,
      },
    });
  }

  async create(data: CreateClientData): Promise<Client> {
    return this.prisma.client.create({
      data,
    });
  }
}
