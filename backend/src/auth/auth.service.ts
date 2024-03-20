import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {

    email: string;

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly roleService: RolesService
    ) { }

    async create(data: any): Promise<User> {
        return this.usersService.create(data);
    }

    async login(email: string, password: string, response: Response) {

        this.email = email
        const user = await this.usersService.findOne({ where: { email } })
        // console.log("user :", user)

        user.is_online = true;
        this.usersService.updatePatch(user.id, user)

        if (!user) {
            throw new BadRequestException('invalid credentials');
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('invalid credentials');
        }

        const user_role = await this.roleService.findOne(user.role_id);
        // console.log("user_role", user_role.name)

        const jwt = await this.jwtService.signAsync({ id: user.id, role: user_role.name});
        response.cookie('jwt', jwt, { httpOnly: true });
        response.status(200);

        return {
            message: "Login success"
        }
    }

    async user(request: Request) {
        try {
            const cookie = request.cookies['jwt'];
            const data = await this.jwtService.verifyAsync(cookie);

            if (!data) {
                throw new UnauthorizedException();
            }

            const user = await this.usersService.findOne({ where: { id: data['id'] } });
            const { password, registration_date, is_online, email, ...result } = user

            return result;

        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    async register(username: string, email: string, password: string) {

        const hashedPassword = await bcrypt.hash(password, 12);

        const user: any = {
            username,
            email,
            password: hashedPassword,
            role_id: 3
        }

        await this.usersService.create(user)

        return {
            message: "register success"
        }
    }

    async logout(response: Response) {
        const email = this.email
        const user = await this.usersService.findOne({ where: { email } })

        user.is_online = false;
        this.usersService.updatePatch(user.id, user)

        response.clearCookie('jwt');
        response.status(200);

        if (!response.cookie) {
            return;
        }
        return {
            message: 'logout success'
        }
    }
}
