import { BadRequestException, Injectable } from '@nestjs/common';
import {
  RegisterAuthDto,
  CodeVerifyAuthDto,
} from 'src/modules/auth/dto/auth.dto';

import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  register(data: RegisterAuthDto) {
    return this.usersService.register(data);
  }

  codeVerify(data: CodeVerifyAuthDto) {
    return this.usersService.codeVerify(data);
  }
}
