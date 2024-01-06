import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class QuotaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(">> Quota Check Interceptor");
    
    const sock = context.switchToWs();
    const client:Socket = sock.getClient();
    console.log("Your IP :", client.handshake.address, "have infinit quota left.");

    return next.handle();
  }
}
