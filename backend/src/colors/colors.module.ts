// colors.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ColorsController } from './colors.controller';
import { ColorsService } from './colors.service';

@Module({
  imports: [PrismaModule],
  controllers: [ColorsController],
  providers: [ColorsService],
})
export class ColorsModule {}
