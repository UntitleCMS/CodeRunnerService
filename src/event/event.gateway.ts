import { SourceCodeModel } from '@app/core';
import { UseInterceptors } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RunnerFactory } from 'src/factories/runner.factory';
import { ClearProcessInterceptor } from 'src/interceptors/clear-process/clear-process.interceptor';
import { LexicalInterceptor } from 'src/interceptors/lexical/lexical.interceptor';
import { QuotaInterceptor } from 'src/interceptors/quota/quota.interceptor';
import { SecurityInterceptor } from 'src/interceptors/security/security.interceptor';
import { StoreInterceptor } from 'src/interceptors/store/store.interceptor';
import { ProcessIOListener } from './processIO.listenner';
import { SocketData } from 'src/models/socket-data';
import { EnsureHasProcessInterceptor } from 'src/interceptors/ensure-hass-process/ensure-hass-process.interceptor';
import { QuotaRepositoryService } from 'src/services/quota-repository/quota-repository.service';

@WebSocketGateway()
export class EventGateway {
  constructor(private readonly runnerFactory: RunnerFactory, private readonly quotaRepo: QuotaRepositoryService) {}

  @UseInterceptors(
    ClearProcessInterceptor,
    QuotaInterceptor,
    LexicalInterceptor,
    SecurityInterceptor,
    StoreInterceptor
  )
  @SubscribeMessage('run')
  runCode(client: Socket, data: SourceCodeModel) {
    const runner = this.runnerFactory.create(data.language);
    const ps = runner.execute(data);
    new ProcessIOListener(client, ps);
    const socketData = client.data as SocketData;
    socketData.process = ps;
    this.quotaRepo.increset(client.handshake.address);
  }

  @UseInterceptors(EnsureHasProcessInterceptor)
  @SubscribeMessage('stdin')
  forwardInput(client: Socket, stdin: string) {
    const socketData = client.data as SocketData;
    socketData.process.stdin(stdin);
  }

  @UseInterceptors(EnsureHasProcessInterceptor)
  @SubscribeMessage('kill')
  killProcess(client: Socket, sigkill: number) {
    const socketData = client.data as SocketData;
    socketData.process.kill(sigkill);
  }
}
