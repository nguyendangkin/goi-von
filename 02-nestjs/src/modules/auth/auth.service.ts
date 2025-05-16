import { BadRequestException, Injectable } from '@nestjs/common';
import {
  RegisterAuthDto,
  ResendCodeAuthDto,
  VerifyCodeAuthDto,
} from 'src/modules/auth/dto/auth.dto';

import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  register(data: RegisterAuthDto) {
    return this.usersService.register(data);
  }

  verifyCode(data: VerifyCodeAuthDto) {
    return this.usersService.verifyCode(data);
  }

  resendCode(data: ResendCodeAuthDto) {
    return this.usersService.resendCode(data);
  }
}
