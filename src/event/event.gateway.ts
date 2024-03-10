import { SourceCodeModel } from '@app/core';
import { UseInterceptors } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RunnerFactory } from 'src/factories/runner.factory';
import { ClearProcessInterceptor } from 'src/interceptors/clear-process/clear-process.interceptor';
import { LexicalInterceptor } from 'src/interceptors/lexical/lexical.interceptor';
import { QuotaInterceptor } from 'src/interceptors/quota/quota.interceptor';
import { SecurityInterceptor } from 'src/interceptors/security/security.interceptor';
import { StoreInterceptor } from 'src/interceptors/store/store.interceptor';
import { redirectOputputTo } from './processIO.listenner';
import { SocketData } from 'src/models/socket-data';
import { EnsureHasProcessInterceptor } from 'src/interceptors/ensure-hass-process/ensure-hass-process.interceptor';
import { QuotaRepositoryService } from 'src/services/quota-repository/quota-repository.service';
import { CacheRepositoryService } from 'src/services/cache-repository/cache-repository.service';
import { CacheInterceptor } from 'src/interceptors/cache/cache.interceptor';
import { SocketEventType } from 'src/constants/socket-event';

@WebSocketGateway()
export class EventGateway implements OnGatewayConnection {
  constructor(
    private readonly runnerFactory: RunnerFactory,
    private readonly quotaRepo: QuotaRepositoryService,
    private readonly cacheRepo: CacheRepositoryService,
  ) {}
  handleConnection(client: Socket, data: any) {
    const caller_ip = client.handshake.address;
    const forwarded_for = client.handshake.headers['x-forwarded-for'] as string;
    const endUserIP = forwarded_for || caller_ip;
    client.data.endUserIP = endUserIP;

    this.reportQuota(client);
  }

  private reportQuota(client: Socket) {
    client.emit(
      SocketEventType.QoataReport,
      this.quotaRepo.quotaReported(client.data.endUserIP),
    );
  }

  @UseInterceptors(
    ClearProcessInterceptor,
    LexicalInterceptor,
    CacheInterceptor,
    QuotaInterceptor,
    SecurityInterceptor,
    StoreInterceptor,
  )
  @SubscribeMessage('run')
  runCode(client: Socket, data: SourceCodeModel) {
    // run code with matching language
    const runner = this.runnerFactory.create(data.language);
    const ps = runner.execute(data);

    // redirect oputput and save output subject to socket data
    const socketData = client.data as SocketData;
    socketData.process = ps;
    redirectOputputTo(client, ps);

    // count qouta
    this.quotaRepo.increset(socketData.endUserIP);
    client.emit(SocketEventType.QuotaConsumedAlert);
    this.reportQuota(client);

    // remove process subject when completly run
    ps.subscribe({
      complete: () => {
        socketData.process = null;
      },
    });

    // save output subject to cache
    this.cacheRepo.add(data.file, ps.asObservable());
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
    if (!!socketData.process) {
      socketData.process.kill(sigkill);
    } else {
      socketData.outputSupscription.unsubscribe();
      client.emit('exit');
      socketData.outputSupscription = null;
    }
  }

  // DEV
  // todo : remove this event
  @SubscribeMessage('dev:clear-console')
  __clear_console() {
    console.clear();
  }
}
