import { Language, SourceCodeFeaturBlockingStrategy } from '@app/core';
import { C12Scaner } from '@app/gcc';
import { Python3Scanner } from '@app/python/python3.scanner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeScanerFactory {
  create(language: string): SourceCodeFeaturBlockingStrategy {
    const mock = {
      scan() {
        return { isSucured: true, msg: 'mock' };
      },
      isSecure() {
        return true;
      },
    };
    
    if (language == Language.Python3) return new Python3Scanner();
    if (language == Language.Java17) return mock;
    if (language == Language.C12) return new C12Scaner();
    else throw new Error(`Language '${language}' is not supported.`);
  }
}
