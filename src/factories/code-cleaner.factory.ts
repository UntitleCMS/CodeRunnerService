import { Language } from "@app/core";
import { Python3Cleaner } from "@app/python/python3.cleancer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CodeCleanerFactory {
  create(language: string) {
    if(language == Language.Python3)
        return new Python3Cleaner();
    // if(language == Language.Java17)
    //     return new JavaVerificator();
    // if(language == Language.C12)
    //     return new C12Verificator();
    else throw new Error(`Language '${language}' is not supported.`);
  }
}
