import { Language, SourceCodeFeaturBlockingStrategy } from '@app/core';
import { C12Cleaner, C12Scaner } from '@app/gcc';
import { JavaCleaner } from '@app/java/java.cleaner';
import { Python3Cleaner } from '@app/python';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CodeScanerFactory {
  create(language: string): SourceCodeFeaturBlockingStrategy {
    if(language == Language.Python3)
      return { scan(code) { return true; }, };
    if (language == Language.Java17)
      return { scan(code) { return true; }, };
    if (language == Language.C12) return new C12Scaner();
    else throw new Error(`Language '${language}' is not supported.`);
  }
}
