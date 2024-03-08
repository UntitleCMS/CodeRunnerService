import { BaseRunner } from '@app/common';
import { SourceCodeModel, SshConnectionConfig } from '@app/core';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export class PythonRunner extends BaseRunner {
  constructor(private readonly config: SshConnectionConfig) {
    super();
  }

  protected createChildProcess(
    code: SourceCodeModel,
  ): ChildProcessWithoutNullStreams {
    console.log(code);
    
    return spawn('ssh', [...this.config.toArray(), `/config/run ${code.file}`]); 
  }
}
