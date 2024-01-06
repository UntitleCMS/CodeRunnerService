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
    data.file = this.getFileName(data);
    console.log('>> Store Interceptor :', data.file);
    return this.saveCode(data).pipe(switchMap(() => next.handle()));
  }

  private getFileName(data: SourceCodeModel): string {
    const hash = createHash('sha256')
      .update(data.sourcecode)
      .digest('base64url');

    if (data.language == Language.Python3) return hash + '.py';
    if (data.language == Language.C12) return hash + '.c';
    if (data.language == Language.Java17) return hash + '.java';
    return hash;
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
