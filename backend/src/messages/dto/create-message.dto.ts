import { User } from "src/users/entities/user.entity";

export class CreateMessageDto {

    id?: number;
    username: string;
    content: string;
    date: Date;
    destinator: User;
}
