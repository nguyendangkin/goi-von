import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterAuthDto,
  ResendCodeAuthDto,
  VerifyCodeAuthDto,
} from 'src/modules/auth/dto/auth.dto';

// @UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterAuthDto) {
    return this.authService.register(data);
  }

  @Post('verify-code')
  verifyCode(@Body() data: VerifyCodeAuthDto) {
    return this.authService.verifyCode(data);
  }

  @Post('resend-code')
  resendCode(@Body() data: ResendCodeAuthDto) {
    return this.authService.resendCode(data);
  }
}
