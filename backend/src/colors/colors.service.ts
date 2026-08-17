// colors.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ColorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveColors() {
    return this.prisma.color.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        value: true,
        hex: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
