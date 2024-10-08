import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      const users = await this.db.user.findMany({
        where: { active: true },
      });
      return { status: 'success', data: users };
    } catch (e) {
      return { status: 'failed', error: e };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password || updateUserDto.passwordConfirm) {
      throw new HttpException(
        { status: 'fail', message: "It's not possible to update password" },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.db.user.update({
      where: { id },
      data: { name: updateUserDto.name, email: updateUserDto.email },
    });

    if (!user) {
      throw new HttpException(
        {
          status: 'fail',
          error: `No user with the id (${id}) was found.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return { status: 'success', user };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async deleteMe(userId: string) {
    await this.db.user.update({
      where: { id: userId },
      data: { active: false },
    });

    return { status: 'success', data: null };
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
