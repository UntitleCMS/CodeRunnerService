import { Language } from "@app/core";
import { C12Cleaner } from "@app/gcc";
import { JavaCleaner } from "@app/java/java.cleaner";
import { Python3Cleaner } from "@app/python";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CodeCleanerFactory {
  create(language: string) {
    if(language == Language.Python3)
        return new Python3Cleaner();
    if(language == Language.Java17)
        return new JavaCleaner();
    if(language == Language.C12)
        return new C12Cleaner();
    else throw new Error(`Language '${language}' is not supported.`);
  }
}
