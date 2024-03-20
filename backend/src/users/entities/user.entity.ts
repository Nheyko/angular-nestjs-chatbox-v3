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
import { Message } from "src/messages/entities/message.entity";
import { Role } from "src/roles/entities/role.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @IsInt()
    @PrimaryGeneratedColumn({
        unsigned: true
    })
    id: number;

    @Length(3, 12)
    @Column({
        unique: true,
        length: 12
    })
    username: string;

    @Length(8, 255)
    @Column({
        length: 255
    })
    password: string;

    @IsEmail()
    @Column({
        unique: true
    })
    email: string;

    @Column('boolean', {default: false})
    is_online: boolean;

    @Column({
        name: 'role_id',
        unsigned: true,
        type: 'int' })
    role_id: number;

    @ManyToOne(() => Role, role => role.users, {nullable: false, cascade: true})
    @JoinColumn({
        name: 'role_id',
    },)
    role: Role;

    @ManyToMany(() => Message, message => message.users, {
        cascade: true
    })
    @JoinTable({
        name: "users_messages",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "message_id",
            referencedColumnName: "id"
        }
    })
    messages: Message[];

    @OneToMany(() => Message, message => message.destinator)
    receivedMessages: Message[];

    @IsDate()
    @CreateDateColumn()
    registration_date: Date;
}
