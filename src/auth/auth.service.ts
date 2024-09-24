import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { LoginAuthDto, SignAuthDto } from './dto/auth.dto';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private db: DatabaseService,
    private config: ConfigService,
  ) {}

  signToken(userId: string) {
    const secret = this.config.get('JWT_SECRET');
    const expiresIn = this.config.get('JWT_EXPIRES_IN');
    return this.jwt.sign({ id: userId }, { secret, expiresIn });
  }

  async signup(createAuthDto: SignAuthDto) {
    try {
      const passwordHash = await bcrypt.hash(createAuthDto.password, 12);

      const user = await this.db.user.create({
        data: {
          name: createAuthDto.name,
          email: createAuthDto.email,
          photo: createAuthDto.photo,
          roles: createAuthDto.roles || ['user'],
          password: passwordHash,
          passwordConfirm: '',
        },
        omit: { password: true, passwordConfirm: true },
      });

      const token = this.signToken(user.id);

      return { status: 'success', user, token };
    } catch (e) {
      return { status: 'fail', error: e.message };
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const user = await this.db.user.findUnique({
        where: { email: loginAuthDto.email },
      });

      const samePassword = await bcrypt.compare(
        loginAuthDto.password,
        user.password,
      );

      if (!user || !samePassword) {
        return new UnauthorizedException('Incorrect email or password');
      }

      const token = this.signToken(user.id);

      return { status: 'success', token };
    } catch (e) {
      return { status: 'fail', error: e.message };
    }
  }
}
