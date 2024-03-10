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

    const caller_ip = client.handshake.address;
    const forwarded_for = client.handshake.headers['x-forwarded-for'] as string;
    const endUserIP = forwarded_for || caller_ip;

    client.data.endUserIP = endUserIP;

    const quota = this.quotaRepo.qoataLeft(endUserIP);

    console.log(`ip forwarding :`, [forwarded_for, caller_ip]);
    console.log("Client IP ", endUserIP, `have ${quota} quota left.`);
    
    if(quota>0)
      return next.handle();

    (sock.getClient() as Socket).emit("error", `Your IP : "${endUserIP}" have no quota left.`);
    return of();
  }
}
