import { IOType, ProcessObservable } from '@app/core';
import { bufferTime, filter, from, map, mergeMap } from 'rxjs';
import { Socket } from 'socket.io';

export function redirectOputputTo(
  socket: Socket,
  processIO: ProcessObservable,
) {
  console.info('Redirecting output to client : ', socket.id);
  socket.data.outputSupscription = processIO
    .pipe(
      bufferTime(100),
      filter((i) => i.length > 0),
      mergeMap((buff) => {
        {
          let x: IOType[] = [];

          for (let i = 0; i < buff.length; i++) {
            const item = buff[i];
            if (
              item.type != 'stdout' ||
              x.length == 0 ||
              x[x.length - 1].type != 'stdout'
            ) {
              x.push(item);
            } else {
              x[x.length - 1].data += item.data;
            }
          }

          let io = from(x);
          return io;
        }
      }),
      map((i) => {
        if (i.type != 'stdout' || i.data.length <= 1000) return i;
        else {
          const x: IOType = { ...i, data: i.data.slice(0, 1000) };
          x.data = x.data + `\r\n[buffer...1000 of ${i.data.length}]` + '\r';
          return x;
        }
      }),
    )
    .subscribe({
      next: (io: IOType) => {
        if (io.type == 'stderr' || io.type == 'stdout' || io.type == 'exit') {
          socket.emit(io.type, io.data);
        }
        if (io.type == 'exit' && io.data == 124) {
          socket.emit('error', 'Timeout');
        }
      },
      complete: () => {socket.data.outputSupscription = null}
    });
}
