import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import {
  ForgotPassDto,
  LoginAuthDto,
  ResetPasswordDto,
  SignAuthDto,
  UpdatePasswordDto,
} from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { User as ReqUser } from '../utils/decorators/user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() signupAuthDto: SignAuthDto) {
    return this.authService.signup(signupAuthDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPassDto, @Req() req: Request) {
    return this.authService.forgotPassword(dto, req);
  }

  @Public()
  @Patch('reset-password/:token')
  resetPassword(@Param('token') token: string, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(token, dto);
  }

  @Patch('update-password')
  updatePassword(@ReqUser() user: User, @Body() dto: UpdatePasswordDto) {
    return this.authService.updatePassword(user, dto);
  }
}
