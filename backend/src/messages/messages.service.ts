import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, } from './entities/message.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) { }

  async create(createMessageDto: CreateMessageDto, user_id: number) {
    // For @TableJoin users_messages
    const user = new User();
    user.id = user_id;

    const message = new Message();
    message.username = createMessageDto.username;
    message.content = createMessageDto.content;
    message.users = [user];
    message.destinator = createMessageDto.destinator;
    await this.messageRepository.save(message);
  }

  async findLatestMessages(count: number): Promise<Message[]> {
    const fetch = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.users', 'user')
      .leftJoin('message.destinator', 'destinator')
      .select(['message.username','user.username', 'message.content', 'user.id', 'destinator.username', 'destinator.id'])
      .orderBy('message.id', 'DESC')
      .limit(count)
      .getMany();
    return fetch;
  }

  async findAll() {
    const messages = await this.messageRepository.find();
    return messages;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
