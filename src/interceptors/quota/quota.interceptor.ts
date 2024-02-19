import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, of } from 'rxjs';
import { Socket } from 'socket.io';
import { QuotaRepositoryService } from 'src/services/quota-repository/quota-repository.service';

@Injectable()
export class QuotaInterceptor implements NestInterceptor {

  constructor(private quotaRepo: QuotaRepositoryService, private config:ConfigService){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(">> Quota Check Interceptor");
    
    const sock = context.switchToWs();
    const client:Socket = sock.getClient();
    const ip = client.handshake.address;

    const quota = this.quotaRepo.qoataLeft(ip);

    console.log("Your IP ", ip, `have ${quota} quota left.`);
    
    if(quota>0)
      return next.handle();

    (sock.getClient() as Socket).emit("error", `Your IP : "${ip}" have no quota left.`);
    return of();
  }
}
