import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventGateway } from './event/event.gateway';
import { ConfigModule } from '@nestjs/config';
import { PythonRunner } from '@app/python';
import { RunnerFactory } from './factories/runner.factory';
import { LexicalFactory } from './factories/lexical.factory';
import { QuotaRepositoryService } from './services/quota-repository/quota-repository.service';
import { CacheRepositoryService } from './services/cache-repository/cache-repository.service';
import { CodeCleanerFactory } from './factories/code-cleaner.factory';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    EventGateway,
    RunnerFactory,
    LexicalFactory,
    CodeCleanerFactory,
    QuotaRepositoryService,
    CacheRepositoryService
  ],
})
export class AppModule {}
