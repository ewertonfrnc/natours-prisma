import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(private db: DatabaseService) {}

  async create(createAuthDto: CreateAuthDto) {
    const passwordHash = await bcrypt.hash(createAuthDto.password, 12);

    try {
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

      return { status: 'success', data: user };
    } catch (e) {
      return { status: 'success', error: e };
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
