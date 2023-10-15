import { Subject, filter, tap } from "rxjs";
import { CodeDto } from "../../common/dto/code-dto";
import { FilesStorageStrategyFactory } from "../files-storage/files-storage-stratregy.factory";
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { ICodeRunner, IO } from "./interfaces/cod-runner.interface";


export abstract class BaseRunner implements ICodeRunner {

  protected fileStorage = FilesStorageStrategyFactory.createStrategy();

  execute(code: CodeDto, resultPipe: Subject<IO>): void {
    const p = this.createChildProcess(code);

    this.castOutput(p, resultPipe)
    this.castError(p, resultPipe)
    this.listenInput(p, resultPipe);
    this.listenKill(p, resultPipe);

    p.on("close", () => { resultPipe.complete(); console.log("closed") })
    p.on("exit", (code) => { resultPipe.next({ type: "exit", data: code }); console.log(`exit code: ${code}`) })
  }

  /**
   * Create a child process that runs the specified code.
   * Simply creates a new child process by `spawn()`
   * @param code code to run
   */
  protected abstract createChildProcess(code: CodeDto): ChildProcessWithoutNullStreams;

  protected listenKill(p: ChildProcessWithoutNullStreams, resultPipe: Subject<IO>) {
    resultPipe.pipe(
      tap(data => {
        if (data.type == "kill") {
          console.log("Killing child process : ", p.pid);
          p.stdin.write(String.fromCharCode(3)); // CTRL + C to kill child process
          p.kill(data.data ?? undefined);
        }
      })
    ).subscribe();
  }

  protected listenInput(p: ChildProcessWithoutNullStreams, resultPipe: Subject<IO>) {
    resultPipe.pipe(
      filter(d => d.type == "stdin"),
      tap(data => {
        console.log("send input to stdin : " + data.data?.toString());
        p.stdin.write(data.data);
      })
    ).subscribe();
  }

  protected castOutput(p: ChildProcessWithoutNullStreams, resultPipe: Subject<IO>) {
    p.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      resultPipe.next({ type: "stdout", data: data.toString() });
    });
  }

  protected castError(p: ChildProcessWithoutNullStreams, resultPipe: Subject<IO>) {
    p.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      resultPipe.next({ type: "stderr", data: data.toString() });
    });
  }
}
