import { Subject } from "rxjs";
import { CodeDto } from "../../../common/dto/code-dto";

export type IO =
  | { type: 'stdin'; data: string }
  | { type: 'stdout'; data: string }
  | { type: 'stderr'; data: string }
  | { type: 'exit'; data: number | null }
  | { type: 'kill'; data: number | null };

export interface ICodeRunner {
  /**
   * @param code code to run
   * @param resultPipe I/O observer for progress
   */
  execute(code:CodeDto, resultPipe?:Subject<IO>): void;
}
