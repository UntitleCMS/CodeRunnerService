import path from "path";
import { CodeDto } from "../../common/dto/code-dto";
import { FilesStorageStrategyFactory } from "../files-storage/files-storage-stratregy.factory";
import { ICodeRunner } from "./interfaces/cod-runner.interface";
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { environment } from "../../configs/environment";
import { BaseRunner } from "./base-runner";


export class Python3Runner extends BaseRunner implements ICodeRunner {

  private _slave_host = `${environment.SLAVE_USER_NAME}@${environment.SLAVE_HOST_PYTHON}`

  protected createChildProcess(code: CodeDto): ChildProcessWithoutNullStreams {
    const name = this.fileStorage.saveSourceCode(code.sourcecode, "py")
    return spawn("ssh", `${this._slave_host} python -u /config/sourcecode/${name}`.split(' ') );
  }

}
