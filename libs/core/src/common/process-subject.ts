import { ReplaySubject } from 'rxjs';

export type IOType =
  | { type: 'stdin'; data: string }
  | { type: 'stdout'; data: string }
  | { type: 'stderr'; data: string }
  | { type: 'exit'; data: number | null }
  | { type: 'kill'; data: number | null };

export class ProcessSubject extends ReplaySubject<IOType> {
  exit(code?: number) {
    this.next({ type: 'exit', data: code });
  }
  kill(signal?: number) {
    this.next({ type: 'kill', data: signal });
  }
  stdin(txt: string) {
    this.next({ type: 'stdin', data: txt });
  }
  stdout(txt: string) {
    this.next({ type: 'stdout', data: txt });
  }
  stderr(txt: string) {
    this.next({ type: 'stderr', data: txt });
  }
}
