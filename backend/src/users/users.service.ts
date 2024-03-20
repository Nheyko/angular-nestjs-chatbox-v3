import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(data: any): Promise<User> {

    const role = new Role;
    role.id = data.role_id;

    const createUserDto = new CreateUserDto;
    createUserDto.username = data.username;
    createUserDto.password = data.password;
    createUserDto.email = data.email;
    createUserDto.role = role;

    return this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<any[]> {

      const users = await this.userRepository.find();

      const safe_users = users.map((user) => {
        const { password, registration_date, email, is_online, ...safe_user } = user;
        return safe_user;
      })

      return safe_users
  }

  async findOne(condition: any): Promise<User> {
    const user = this.userRepository.findOne(condition);
    return user;
  }

  async updatePatch(id: number, updateUserDto: UpdateUserDto) {

    const userToUpdate = await this.userRepository.findOne({ where: { id } });

    if (!userToUpdate) {
      throw new Error(`User with id ${id} not found`);
    }
    Object.assign(userToUpdate, updateUserDto);
    return this.userRepository.save(userToUpdate);
  }

  async updatePut(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
