import { BaseRunner } from '@app/common';
import { SourceCodeModel, SshConnectionConfig } from '@app/core';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export class C12Runner extends BaseRunner {
  constructor(private readonly config: SshConnectionConfig) {
    super();
  }

  protected createChildProcess(
    code: SourceCodeModel,
  ): ChildProcessWithoutNullStreams {
    return spawn('ssh', [...this.config.toArray(), `gcc -o ./sourcecode/${code.file}.out ./sourcecode/${code.file} && timeout 10 stdbuf -o0 ./sourcecode/${code.file}.out`]);
  }
}
