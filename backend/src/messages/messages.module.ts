import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Message, UsersMessages } from './entities/message.entity';
import { Message } from './entities/message.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    // TypeOrmModule.forFeature([UsersMessages]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService]
})
export class MessagesModule {}
