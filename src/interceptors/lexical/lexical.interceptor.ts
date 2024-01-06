import { SourceCodeModel } from '@app/core';
import { Python3Verificator } from '@app/python/python3.verificator';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LexicalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(">> Lexical intercept");
    const data = context.switchToWs().getData() as SourceCodeModel;

    const v = new Python3Verificator();
    const isValid = v.verify(data);

    console.log("Is valid: " + isValid);
    
    return next.handle();
  }
}
