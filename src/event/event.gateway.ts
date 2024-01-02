import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class EventGateway {

  @SubscribeMessage('run')
  handleMessage(client: Socket, payload: any) {
    console.log(payload)
  }

}
