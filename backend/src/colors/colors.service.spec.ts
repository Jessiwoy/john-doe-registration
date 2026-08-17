// colors.service.spec.ts
import { PrismaService } from '../prisma/prisma.service';
import { ColorsService } from './colors.service';

describe('ColorsService', () => {
  it('retorna apenas cores ativas com os campos públicos', async () => {
    const findMany = jest.fn().mockResolvedValue([
      {
        id: 'color-id',
        name: 'Azul',
        value: 'blue',
        hex: '#0000FF',
      },
    ]);
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
    expect(findMany).toHaveBeenCalledWith({
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
