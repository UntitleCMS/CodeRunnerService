import { SourceCodeModel } from '@app/core';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LexicalFactory } from 'src/factories/lexical.factory';

@Injectable()
export class LexicalInterceptor implements NestInterceptor {
  constructor(private readonly lexicalFactory: LexicalFactory){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(">> Lexical intercept");
    const data = context.switchToWs().getData() as SourceCodeModel;

    const v = this.lexicalFactory.create(data.language);
    const isValid = v.verify(data);

    console.log("Is valid: " + isValid);
    
    return next.handle();
  }
}
