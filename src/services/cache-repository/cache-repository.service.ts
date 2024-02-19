import { IOType, ProcessSubject } from '@app/core';
import { Injectable } from '@nestjs/common';

interface CacheRepository {
  clearCache(): void;
  add(key: string, value: ProcessSubject): void;
}

@Injectable()
export class CacheRepositoryService implements CacheRepository {
  private readonly mockDB = new Map<string, any>();

  clearCache(): void {
    this.mockDB.clear();
  }

  add(key: string, value: ProcessSubject): void {
    if (!key) return;

    let buff: (IOType & { timestamp: number })[] = [];

    let subscribe = value.subscribe({
      next: (o) => {
        if (o.type == 'stdin' || (o.type == 'exit' && o.data == 124)) {
          subscribe.unsubscribe();
        }
        buff.push({ ...o, timestamp: Date.now() });
      },
      complete: () => {
        console.log(key, ' <-- ', buff);
        this.mockDB.set(key, buff);
        console.log(this.mockDB)
      },
    });
  }
}
