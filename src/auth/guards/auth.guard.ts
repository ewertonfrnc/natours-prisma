import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
    private db: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token)
      throw new UnauthorizedException(
        'You are not logged in! Please log in to get access',
      );

    const decoded = await this.jwtService.verifyAsync(token, {
      secret: this.config.get('JWT_SECRET'),
    });

    const currentUser = await this.db.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      throw new UnauthorizedException(
        'The user belonging to this token does not exist',
      );
    }

    // Check if user changed password after the jwt token was issued
    if (currentUser.passwordChangedAt) {
      const changedTimestamp = parseInt(
        String(currentUser.passwordChangedAt.getTime() / 1000),
        10,
      );

      if (decoded.iat < changedTimestamp) {
        throw new UnauthorizedException(
          'User recently changed password! Please log in again',
        );
      }
    }

    // Grant Access
    request['user'] = currentUser;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
