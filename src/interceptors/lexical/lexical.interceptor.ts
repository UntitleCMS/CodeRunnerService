import { SourceCodeModel } from '@app/core';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Socket } from 'socket.io';
import { LexicalFactory } from 'src/factories/lexical.factory';

@Injectable()
export class LexicalInterceptor implements NestInterceptor {
  constructor(private readonly lexicalFactory: LexicalFactory){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const data = context.switchToWs().getData() as SourceCodeModel;
    
    const v = this.lexicalFactory.create(data.language);
    const isValid = v.verify(data);

    console.log(">> Lexical intercept :", isValid);
    
    if (isValid)
      return next.handle();
    
    const socket:Socket = context.switchToWs().getClient();
    socket.emit("error", "Syntax error");
    return of();
  }
}
