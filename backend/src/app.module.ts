// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { ColorsModule } from './colors/colors.module';

@Module({
  imports: [ClientsModule, ColorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
