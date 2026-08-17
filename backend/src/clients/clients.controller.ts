// clients.controller.ts
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ZodError } from 'zod';
import { ClientsService } from './clients.service';
import { createClientSchema } from './clients.schema';
import type { CreateClientInput } from './clients.schema';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() body: CreateClientInput) {
    try {
      const data = createClientSchema.parse(body);
      await this.clientsService.create(data);

      return { message: 'Cliente cadastrado com sucesso.' };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException('Dados inválidos.');
      }

      throw error;
    }
  }
}
