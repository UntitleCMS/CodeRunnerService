import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from, switchMap } from 'rxjs';
import { createHash } from 'crypto';
import { Language, SourceCodeModel } from '@app/core';
import { writeFile } from 'fs';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class StoreInterceptor implements NestInterceptor {
  codeStorage: string;

  constructor(private config: ConfigService) {
    this.codeStorage = this.config.get('LOCAL_CODE_STORAGE');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const data: SourceCodeModel = context.switchToWs().getData();
    console.log('>> Store Interceptor :', data.file);
    return this.saveCode(data).pipe(switchMap(() => next.handle()));
  }

  private saveCode(data: SourceCodeModel): Observable<void> {
    return this.saveCodeToLocal(data);
  }

  private saveCodeToLocal(data: SourceCodeModel) {
    const filePath = path.join(this.codeStorage, data.file);
    return from(
      new Promise<void>((resolve, reject) => {
        writeFile(filePath, data.sourcecode, 'utf8', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }),
    );
  }
}
