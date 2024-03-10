import { BaseRunner } from '@app/common';
import { SourceCodeModel, SshConnectionConfig } from '@app/core';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

export class Java17Runner extends BaseRunner {
  constructor(private readonly config: SshConnectionConfig) {
    super();
  }

  protected createChildProcess(
    code: SourceCodeModel,
  ): ChildProcessWithoutNullStreams {
    return spawn('ssh', [...this.config.toArray(), `timeout ${this.config.MAX_EXECUTE_TIME} /opt/jdk-17.0.6+10/bin/java ./sourcecode/${code.file}`]);
  }
}
