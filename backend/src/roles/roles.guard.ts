import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
    private jwtService: JwtService,
) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // console.log("requiredRole", requiredRoles);

    const request = context.switchToHttp().getRequest();
    const cookie = request.cookies['jwt'];

    request.user = this.jwtService.verify(cookie);
    // console.log(request.user)

    const userRole = request.user.role;
    // console.log("userRole", userRole);

    if(requiredRoles !== userRole) return false;

    return true;
  }
}