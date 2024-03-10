import { Language, SourceCodeFeaturBlockingStrategy } from '@app/core';
import { C12Scaner } from '@app/gcc';
import { Java17Scanner } from '@app/java';
import { Python3Scanner } from '@app/python/python3.scanner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeScanerFactory {
  create(language: string): SourceCodeFeaturBlockingStrategy {
    if (language == Language.Python3) return new Python3Scanner();
    if (language == Language.Java17) return new Java17Scanner();
    if (language == Language.C12) return new C12Scaner();
    else throw new Error(`Language '${language}' is not supported.`);
  }
}
