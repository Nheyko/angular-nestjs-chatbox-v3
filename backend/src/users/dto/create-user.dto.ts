import { Role } from "src/roles/entities/role.entity";

export class CreateUserDto {
    id?: number;
    username: string;
    password: string;
    email: string;
    is_online: boolean;
    role: Role;
    registration_date?: Date;
}
