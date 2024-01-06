import { Language, SourceCodeModel } from '@app/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Socket } from 'socket.io';
import { SocketData } from 'src/models/socket-data';

const languages = Object.getOwnPropertyNames(Language)
  .filter((n) => n != 'name' && n != 'length' && n != 'prototype')
  .map((n) => Language[n]);

@Injectable()
export class ClearProcessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('>> Clear Process Interceptor');
    const socketData: SocketData = context.switchToWs().getClient().data;
    if (socketData.process) {
      socketData.process.kill();
      socketData.process.complete();
      socketData.process = null;
    }

    const data: SourceCodeModel = context.switchToWs().getData();
    if(languages.includes(data.language))
      return next.handle();
    
    
    const socket: Socket = context.switchToWs().getClient();
    socket.emit("error", `Language ${data.language} is not supported.`);
    return of();
  }
}
