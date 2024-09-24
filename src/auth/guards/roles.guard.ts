import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      // If route does not need role, grant access
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    console.log(
      { requiredRoles },
      { roles: user.roles },
      requiredRoles.some((role) => user.roles?.includes(role)),
      requiredRoles.includes(user.roles),
    );

    if (!requiredRoles.some((role) => user.roles?.includes(role))) {
      throw new ForbiddenException('You are not authorized');
    } else {
      return true;
    }
  }
}
