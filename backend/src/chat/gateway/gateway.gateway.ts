import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway(8091, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: false,
  },
  allowEIO3: true,
})
export class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private logger: Logger,
    private readonly usersService: UsersService
  ) { }

  connectedUsers: string[] = [];

  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client ${client.id} is connected !`)
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client ${client.id} is disconnected !`)
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() payload: any) {

    const user = await this.usersService.findOne( { where : {id: payload.destinator}});
    let destinator = null;

    if(!payload.destinator)
      destinator = null;
    else {
      destinator = user

      
      delete destinator.password
      delete destinator.registration_date
      delete destinator.email
      delete destinator.is_online
    }

    const newPayload: any = {
      user_id: payload.user_id,
      username: payload.username,
      content: payload.message_content,
      destinator: destinator
    }
    this.server.emit('newMessage', newPayload)
  }

  @SubscribeMessage('onUserConnect')
  connect(@MessageBody() messageBody: any) {
    if (messageBody.isConnecting === true) {
      if (!this.connectedUsers.includes(messageBody.username)) {
        this.connectedUsers.push(messageBody.username);
      }
    } else {
      const index = this.connectedUsers.indexOf(messageBody.username);
      if (index !== -1) {
        this.connectedUsers.splice(index, 1);
        this.server.emit('connectResponse', this.connectedUsers)
      }
    }
    this.server.emit('connectResponse', this.connectedUsers);
  }
}
