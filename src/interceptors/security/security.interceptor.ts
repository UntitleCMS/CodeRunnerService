import { SourceCodeModel } from '@app/core';
import { C12Scaner } from '@app/gcc';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Socket } from 'socket.io';
import { CodeScanerFactory } from 'src/factories/code-scaner.factory';

@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  constructor(private readonly scanerFactory: CodeScanerFactory) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const data = context.switchToWs().getData() as SourceCodeModel;
    const scaner = this.scanerFactory.create(data.language);
    const isSecure = scaner.scan(data);

    console.log('>> Security Intercept :', isSecure);

    if (isSecure) return next.handle();
    else {
      const sock = context.switchToWs().getClient() as Socket;
      sock.emit('error', 'Code not secure');
      return of();
    }
  }
}
