import { Language, SshConnectionConfig } from '@app/core';
import { PythonRunner } from '@app/python';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RunnerFactory {
  create(language: string) {
    if (language == Language.Python3){
      const config = new SshConnectionConfig();
      config.key = 'C:\\Users\\Anirut\\Desktop\\MyFnPj\\code-runner\\CompilerContainer\\Keys\\id_rsa';
      config.port = 2222;
      config.username = 'runner';
      return new PythonRunner(config);
    }
    else throw new Error(`Language '${language}' is not supported`);
  }
}
