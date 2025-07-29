import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggersModule } from './loggers/loggers.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), LoggersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
