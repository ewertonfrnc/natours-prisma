import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import sendEmail from '../utils/email.utils';

import {
  ForgotPassDto,
  LoginAuthDto,
  ResetPasswordDto,
  SignAuthDto,
  UpdatePasswordDto,
} from './dto/auth.dto';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly db: DatabaseService,
    private readonly config: ConfigService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private async signToken(userId: string): Promise<string> {
    const secret = this.config.get('JWT_SECRET');
    const expiresIn = this.config.get('JWT_EXPIRES_IN');
    return this.jwt.sign({ id: userId }, { secret, expiresIn });
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  private async findUserById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  private async updateUserPassword(
    userId: string,
    passwordHash: string,
  ): Promise<void> {
    await this.db.user.update({
      where: { id: userId },
      data: {
        password: passwordHash,
        passwordConfirm: '',
        passwordResetToken: null,
        passwordResetExpires: null,
        passwordChangedAt: new Date(),
      },
    });
  }

  private excludeSensitiveUserData(user: User) {
    const { password, passwordConfirm, passwordChangedAt, ...userData } = user;
    return userData;
  }

  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private getResetTokenExpiry(): Date {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  }

  async signup(createAuthDto: SignAuthDto) {
    const passwordHash = await this.hashPassword(createAuthDto.password);
    try {
      const user = await this.db.user.create({
        data: {
          ...createAuthDto,
          roles: createAuthDto.roles || ['user'],
          password: passwordHash,
          passwordConfirm: '',
        },
      });

      const token = await this.signToken(user.id);

      return { status: 'success', user, token };
    } catch (e) {
      throw new HttpException(
        { status: 'fail', error: e.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.findUserByEmail(loginAuthDto.email);

    if (
      !user ||
      !(await bcrypt.compare(loginAuthDto.password, user.password))
    ) {
      throw new HttpException(
        { status: 'fail', error: 'Incorrect email or password' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.signToken(user.id);
    return {
      status: 'success',
      user: this.excludeSensitiveUserData(user),
      token,
    };
  }

  async forgotPassword(dto: ForgotPassDto, req: Request) {
    const user = await this.findUserByEmail(dto.email);
    if (!user) {
      throw new HttpException(
        { status: 'fail', message: 'Email not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const resetToken = this.generateResetToken();
    const resetHash = this.hashToken(resetToken);
    const expiresIn = this.getResetTokenExpiry();

    await this.db.user.update({
      where: { id: user.id },
      data: { passwordResetToken: resetHash, passwordResetExpires: expiresIn },
    });

    const resetURL = `${req.protocol}://${req.get('host')}/users/reset-password/${resetToken}`;
    const message = `Forgot password? Submit a Patch request with your new password to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`;

    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    return { status: 'success', message: 'Token sent to email!' };
  }

  async resetPassword(resetToken: string, dto: ResetPasswordDto) {
    const hashedToken = this.hashToken(resetToken);

    const user = await this.db.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new HttpException(
        { status: 'fail', message: 'Token is invalid or has expired' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordHash = await this.hashPassword(dto.password);
    await this.updateUserPassword(user.id, passwordHash);

    const token = await this.signToken(user.id);
    return { status: 'success', token };
  }

  async updatePassword(reqUser: User, dto: UpdatePasswordDto) {
    const user = await this.findUserById(reqUser.id);

    if (!user || !(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new HttpException(
        { status: 'fail', message: 'Incorrect password' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const newPasswordHash = await this.hashPassword(dto.newPassword);
    await this.updateUserPassword(user.id, newPasswordHash);

    const token = await this.signToken(user.id);
    return { status: 'success', token };
  }
}
