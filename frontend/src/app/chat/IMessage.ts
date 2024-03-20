import { User } from "../users/IUser";

export interface Message {
    id?: number;
    content: string,
    username: string
    users?: User[],
    destinator: User;
}