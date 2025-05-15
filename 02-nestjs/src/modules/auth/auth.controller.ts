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
  CodeVerifyAuthDto,
} from 'src/modules/auth/dto/auth.dto';

// @UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterAuthDto) {
    return this.authService.register(data);
  }

  @Post('code-verify')
  codeVerify(@Body() data: CodeVerifyAuthDto) {
    return this.authService.codeVerify(data);
  }
}
