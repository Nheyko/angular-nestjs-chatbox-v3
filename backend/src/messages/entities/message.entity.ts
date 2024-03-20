import {
    Contains,
    IsInt,
    Length,
    IsEmail,
    IsFQDN,
    IsDate,
    Min,
    Max,
} from "class-validator"
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Messages')
export class Message {

    @PrimaryGeneratedColumn({
        unsigned: true
    })
    id: number;

    @Column()
    username: string;

    @Column()
    content: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "destinator_id" })
    destinator: User;

    @CreateDateColumn()
    date: Date;

    @ManyToMany(() => User, user => user.messages)
    users: User[];
}
