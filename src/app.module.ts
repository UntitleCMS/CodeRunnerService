import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventGateway } from './event/event.gateway';
import { ConfigModule } from '@nestjs/config';
import { PythonRunner } from '@app/python';
import { RunnerFactory } from './factories/runner.factory';
import { LexicalFactory } from './factories/lexical.factory';
import { QuotaRepositoryService } from './services/quota-repository/quota-repository.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    EventGateway,
    RunnerFactory,
    LexicalFactory,
    QuotaRepositoryService
  ],
})
export class AppModule {}
