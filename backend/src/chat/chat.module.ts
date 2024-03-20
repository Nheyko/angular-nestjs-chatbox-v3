import { Logger, Module } from '@nestjs/common';
import { GatewayGateway } from './gateway/gateway.gateway';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MessagesModule,
    UsersModule
  ],
  providers: [
    GatewayGateway,
    Logger,
  ],
})
export class ChatModule {}
