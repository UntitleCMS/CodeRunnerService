import { Language, SshConnectionConfig } from '@app/core';
import { PythonRunner } from '@app/python';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RunnerFactory {

  constructor(private readonly config: ConfigService){}

  create(language: string) {
    const config = new SshConnectionConfig();
    config.key = this.config.get('PYTHON_SANDBOX_KEY');
    config.port = this.config.get('PYTHON_SANDBOX_PORT');
    config.username = this.config.get('PYTHON_SANDBOX_USER');

    if (language == Language.Python3){
      return new PythonRunner(config);
    }
    else throw new Error(`Language '${language}' is not supported`);
  }
}
