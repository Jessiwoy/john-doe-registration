// colors.service.spec.ts
import { describe, expect, it, jest } from '@jest/globals';
import { PrismaService } from '../prisma/prisma.service';
import { ColorsService } from './colors.service';

describe('ColorsService', () => {
  it('retorna apenas cores ativas com os campos públicos', async () => {
    const colors = [
      {
        id: 'color-id',
        name: 'Azul',
        value: 'blue',
        hex: '#0000FF',
      },
    ];
    const findMany = jest.fn<(_args: unknown) => Promise<typeof colors>>(() =>
      Promise.resolve(colors),
    );
    const prisma = {
      color: {
        findMany,
      },
    } as unknown as PrismaService;
    const colorsService = new ColorsService(prisma);

    await expect(colorsService.findActiveColors()).resolves.toEqual([
      {
        id: 'color-id',
        name: 'Azul',
        value: 'blue',
        hex: '#0000FF',
      },
    ]);
    expect(findMany.mock.calls[0]?.[0]).toEqual({
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
  });
});
