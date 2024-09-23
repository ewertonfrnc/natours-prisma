import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '@nestjs/config';
import { config } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private config: ConfigService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    try {
      const passwordHash = await bcrypt.hash(createAuthDto.password, 12);

      const user = await this.db.user.create({
        data: {
          name: createAuthDto.name,
          email: createAuthDto.email,
          photo: createAuthDto.photo,
          password: passwordHash,
          passwordConfirm: '',
        },
        omit: { password: true, passwordConfirm: true },
      });

      const secret = this.config.get('JWT_SECRET');
      const expiresIn = this.config.get('JWT_EXPIRES_IN');
      const token = jwt.sign({ id: user.id }, secret, { expiresIn });

      return { status: 'success', user, token };
    } catch (e) {
      return { status: 'fail', error: e.message };
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
