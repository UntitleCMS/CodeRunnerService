import { IOType, ProcessObservable, ProcessSubject } from '@app/core';
import { Injectable } from '@nestjs/common';
import { Observable, concatMap, delay, from, of, tap } from 'rxjs';

interface CacheRepository {
  clearCache(): void;
  add(key: string, value: ProcessObservable): void;
  get(key: string): ProcessObservable | null;
}

@Injectable()
export class CacheRepositoryService implements CacheRepository {
  private readonly mockDB = new Map<string, any>();

  clearCache(): void {
    this.mockDB.clear();
  }

  add(key: string, value: ProcessObservable): void {
    if (!key) return;

    let buff: (IOType & { timestamp: number })[] = [];

    let subscribe = value.subscribe({
      next: (o) => {
        if (
          o.type == 'stdin' ||
          o.type == 'kill' ||
          (o.type == 'exit' && o.data == 124)
        ) {
          subscribe.unsubscribe();
        }
        buff.push({ ...o, timestamp: Date.now() });
      },
      complete: () => {
        console.log(key, ' <-- ', buff);
        this.mockDB.set(key, buff);
        setTimeout(() => {
          this.mockDB.delete(key);
        }, 10*60*1000);
      },
    });
  }
  get(key: string): ProcessObservable | null {
    let buff: (IOType & { timestamp: number })[] = this.mockDB.get(key);
    if (!buff) return null;

    return from(buff).pipe(
      concatMap((i, index) => {
        const delayTime =
          index > 0 ? buff[index].timestamp - buff[index - 1].timestamp : 0;
        return of(i).pipe(delay(delayTime));
      }),
    );
  }
}
