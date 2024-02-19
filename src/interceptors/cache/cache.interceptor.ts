import { Language, SourceCodeModel } from '@app/core';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { createHash } from 'crypto';
import { Observable, of } from 'rxjs';
import { redirectOputputTo } from 'src/event/processIO.listenner';
import { CacheRepositoryService } from 'src/services/cache-repository/cache-repository.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {

  constructor(
    private readonly cacheRepo: CacheRepositoryService,
  ){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const data: SourceCodeModel = context.switchToWs().getData();
    data.file = this.getFileName(data);
    console.log('>> Cache for :', data.file);

    let buff = this.cacheRepo.get(data.file);

    if(!buff)
      return  next.handle();

    console.log("Streaming cache :", true);
    redirectOputputTo(context.switchToWs().getClient(), buff)

    return of();
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
}
