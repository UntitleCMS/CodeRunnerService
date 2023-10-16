import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { CodeDto } from "../../common/dto/code-dto";
import { BaseRunner } from "./base-runner";
import { ICodeRunner } from "./interfaces/cod-runner.interface";
import { environment } from "../../configs/environment";

export class GCC12Runner extends BaseRunner implements ICodeRunner {

  private _slave_host = `${environment.SLAVE_USER_NAME}@${environment.SLAVE_HOST_GCC}`

  protected createChildProcess(code: CodeDto): ChildProcessWithoutNullStreams {
    const name = this.fileStorage.saveSourceCode(code.sourcecode, "c")
    return spawn("ssh", `${this._slave_host} gcc -o /config/sourcecode/${name}.o /config/sourcecode/${name} && stdbuf -o0 /config/sourcecode/${name}.o`.split(' '));
  }

}
