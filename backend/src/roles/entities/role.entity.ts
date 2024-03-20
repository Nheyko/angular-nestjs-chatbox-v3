import { Injectable } from "@nestjs/common";
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
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Roles')
export class Role {

    @PrimaryGeneratedColumn({
        unsigned: true
    })
    id: number;

    @Length(1, 10)
    @Column({
        unique: true,
        length: 10
    })
    name: string;

    @OneToMany(() => User, user => user.role, {eager: true})
    @JoinColumn()
    users: User[];
}