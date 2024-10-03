import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.db.user.create({
      data: createUserDto,
    });

    return { status: 'success', user };
  }

  async findAll() {
    try {
      const users = await this.db.user.findMany();
      return { status: 'success', data: users };
    } catch (e) {
      return { status: 'failed', error: e };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getMe(user: User) {
    return { status: 'success', user };
  }

  async createBatch(batch: User[]) {
    try {
      const users = await this.db.user.createManyAndReturn({
        data: batch,
        skipDuplicates: true,
      });

      return { status: 'success', results: users.length, users };
    } catch (e) {
      return { status: 'failed', error: e };
    }
  }
}
