import { CodeRunnerStrategy, ProcessSubject, SourceCodeModel } from '@app/core';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { filter, tap } from 'rxjs';

export abstract class BaseRunner implements CodeRunnerStrategy {
  /**
   * Create a child process that runs the specified code.
   * Simply creates a new child process by `spawn()`
   * @param code code to run
   */
  protected abstract createChildProcess(
    code: SourceCodeModel,
  ): ChildProcessWithoutNullStreams;

  execute(code: SourceCodeModel): ProcessSubject {
    const resultPipe = new ProcessSubject();
    const p = this.createChildProcess(code);

    this.castOutput(p, resultPipe);
    this.castError(p, resultPipe);
    this.listenInput(p, resultPipe);
    this.listenKill(p, resultPipe);
    this.listenClose(p, resultPipe);
    this.listenExit(p, resultPipe);

    return resultPipe;
  }

  protected listenClose(
    p: ChildProcessWithoutNullStreams,
    resultPipe: ProcessSubject,
  ) {
    p.on('close', () => {
      resultPipe.complete();
      console.log('closed');
    });
  }

  protected listenExit(
    p: ChildProcessWithoutNullStreams,
    resultPipe: ProcessSubject,
  ) {
    p.on('exit', (code) => {
      resultPipe.next({ type: 'exit', data: code });
      console.log(`exit code: ${code}`);
    });
  }

  protected listenKill(
    p: ChildProcessWithoutNullStreams,
    resultPipe: ProcessSubject,
  ) {
    resultPipe
      .pipe(
        tap((data) => {
          if (data.type == 'kill') {
            console.log('Killing child process : ', p.pid);
            p.stdin.end();
            p.kill('SIGKILL');
          }
        }),
      )
      .subscribe();
  }

  protected listenInput(
    p: ChildProcessWithoutNullStreams,
    resultPipe: ProcessSubject,
  ) {
    resultPipe
      .pipe(
        filter((d) => d.type == 'stdin'),
        tap((data) => {
          console.log('send input to stdin : ' + data.data?.toString());
          p.stdin.write(data.data);
        }),
      )
      .subscribe();
  }

  protected castOutput(
    p: ChildProcessWithoutNullStreams,
    resultPipe: ProcessSubject,
  ) {
    p.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      resultPipe.next({ type: 'stdout', data: data.toString() });
    });
  }

  protected castError(
    p: ChildProcessWithoutNullStreams,
    resultPipe: ProcessSubject,
  ) {
    p.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      resultPipe.next({ type: 'stderr', data: data.toString() });
    });
  }
}
