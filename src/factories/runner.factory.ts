import { Language, SshConnectionConfig } from '@app/core';
import { Java17Runner } from '@app/java';
import { PythonRunner } from '@app/python';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RunnerFactory {

  constructor(private readonly config: ConfigService){}

  create(language: string) {
    const config = new SshConnectionConfig();
    
    if (language == Language.Python3){
      config.key = this.config.get('PYTHON_SANDBOX_KEY');
      config.port = this.config.get('PYTHON_SANDBOX_PORT');
      config.username = this.config.get('PYTHON_SANDBOX_USER');
      return new PythonRunner(config);
    }

    if (language == Language.Java17){
      config.key = this.config.get('JAVA_SANDBOX_KEY');
      config.port = this.config.get('JAVA_SANDBOX_PORT');
      config.username = this.config.get('JAVA_SANDBOX_USER');
      return new Java17Runner(config);
    }

    throw new Error(`Language '${language}' is not supported`);
  }
}
