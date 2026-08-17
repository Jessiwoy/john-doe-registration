// colors.controller.spec.ts
import { ColorsController } from './colors.controller';
import { ColorsService } from './colors.service';

describe('ColorsController', () => {
  it('retorna cores disponíveis', async () => {
    const colors = [
      {
        id: 'color-id',
        name: 'Azul',
        value: 'blue',
        hex: '#0000FF',
      },
    ];
    const colorsService = {
      findActiveColors: jest.fn().mockResolvedValue(colors),
    } as unknown as ColorsService;
    const colorsController = new ColorsController(colorsService);

    await expect(colorsController.findActiveColors()).resolves.toEqual(colors);
  });
});
