import { IOType, ProcessSubject } from '@app/core';
import { Socket } from 'socket.io';

export function redirectOputputTo(socket: Socket, processIO: ProcessSubject) {
  console.info('Redirecting output to client : ', socket.id);
  processIO.subscribe((io: IOType) => {
    if (io.type == 'stderr' || io.type == 'stdout' || io.type == 'exit') {
      socket.emit(io.type, io.data);
    }
  });
}
