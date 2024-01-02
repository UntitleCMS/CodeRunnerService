import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventGateway } from './event/event.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [EventGateway],
})
export class AppModule {}
