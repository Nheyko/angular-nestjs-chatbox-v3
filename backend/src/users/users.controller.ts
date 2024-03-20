import { Controller, Post, Body, Patch, Param, Delete, Put, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({where: {id}});
  }

  @UseGuards(RolesGuard)
  @Role('Admin')
  @Get()
  findAll(@Req() { user }) {
    // console.log("User", user)
    return this.usersService.findAll();
  }

  @Patch(':id')
  updatePatch(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updatePatch(+id, updateUserDto);
  }


  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updatePut(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
