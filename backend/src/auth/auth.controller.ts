import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService) { }

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    return this.authService.register(username, email, password);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(email, password, response);
  }

  @Get('user')
  async user(@Req() request: Request) {
    return this.authService.user(request);
  }

  @Post('logout')
  async logout(@Res({passthrough: true}) response: Response) {
    return this.authService.logout(response);
  }
}
