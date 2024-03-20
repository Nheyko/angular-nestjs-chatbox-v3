import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(
    @Body() data: any,
  ) {
    const createMessageDto = new CreateMessageDto();
    createMessageDto.username = data.username;
    createMessageDto.content = data.message_content;
    createMessageDto.destinator = data.destinator;

    const user_id = data.user_id;
    return this.messagesService.create(createMessageDto, user_id);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get('latest/:count')
  findLatestMessages(@Param('count') count: number) {
    return this.messagesService.findLatestMessages(count);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
