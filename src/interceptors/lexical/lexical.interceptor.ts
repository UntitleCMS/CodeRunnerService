import { SourceCodeModel } from '@app/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Socket } from 'socket.io';
import { CodeCleanerFactory } from 'src/factories/code-cleaner.factory';
import { SyntaxCheckerFactory } from 'src/factories/syntax-checker.factory';

@Injectable()
export class LexicalInterceptor implements NestInterceptor {
  constructor(
    private readonly lexicalFactory: SyntaxCheckerFactory,
    private readonly codeCleaner: CodeCleanerFactory,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const data = context.switchToWs().getData() as SourceCodeModel;

    const v = this.lexicalFactory.create(data.language);
    const isValid = v.verify(data);

    console.log('>> Lexical intercept :', isValid);

    if (!isValid) {
      const socket: Socket = context.switchToWs().getClient();
      socket.emit('error', 'Syntax error');
      return of();
    }

    const cleaner = this.codeCleaner.create(data.language);
    data.sourcecode = cleaner.Clean(data).sourcecode;
    return next.handle();
  }
}
