import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Socket } from 'socket.io';
import { SocketData } from 'src/models/socket-data';

@Injectable()
export class EnsureHasProcessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const socket: Socket = context.switchToWs().getClient();
    const socketData: SocketData = socket.data;

    const isAllowed = !!socketData.process || !!socketData.outputSupscription;
    console.log('>> Ensure Has Process Interceptor :', isAllowed);

    if (isAllowed) return next.handle();

    // socket.emit("error", "Have no process is running.");
    return of();
  }
}
