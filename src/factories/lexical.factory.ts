import { Language } from "@app/core";
import { Python3Verificator } from "@app/python";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LexicalFactory {
  create(language: string) {
    if(language == Language.Python3)
        return new Python3Verificator();
    else throw new Error(`Language '${language}' is not supported.`);
  }
}
