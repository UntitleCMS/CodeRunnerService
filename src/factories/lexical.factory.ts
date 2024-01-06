import { Language } from "@app/core";
import { C12Verificator } from "@app/gcc";
import { JavaVerificator } from "@app/java";
import { Python3Verificator } from "@app/python";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LexicalFactory {
  create(language: string) {
    if(language == Language.Python3)
        return new Python3Verificator();
    if(language == Language.Java17)
        return new JavaVerificator();
    if(language == Language.C12)
        return new C12Verificator();
    else throw new Error(`Language '${language}' is not supported.`);
  }
}
