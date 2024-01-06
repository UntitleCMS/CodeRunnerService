import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { SocketData } from 'src/models/socket-data';

@Injectable()
export class ClearProcessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(">> Clear Process Interceptor");
    const socketData:SocketData = context.switchToWs().getClient().data;
    if (socketData.process){
      socketData.process.kill();
      socketData.process.complete();
      socketData.process = null;
    }
    return next.handle();
  }
}
