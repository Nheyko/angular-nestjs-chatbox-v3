import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    id?: number;
    username: string;
    password: string;
    email: string;
    is_online: boolean;
    role_id: number;
    registration_date?: Date;
}
