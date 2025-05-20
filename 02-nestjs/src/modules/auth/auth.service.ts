import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ForwardPasswordActivationCodedAuthDto,
  ForwardPasswordAuthDto,
  RegisterAuthDto,
  ResendCodeAuthDto,
  VerifyCodeAuthDto,
} from 'src/modules/auth/dto/auth.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(data: RegisterAuthDto) {
    return await this.usersService.register(data);
  }

  async verifyCode(data: VerifyCodeAuthDto) {
    return await this.usersService.verifyCode(data);
  }

  async resendCode(data: ResendCodeAuthDto) {
    return await this.usersService.resendCode(data);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      return null;
    }
    // Kiểm tra mật khẩu
    const isMatch = await this.usersService.comparePassword(
      password,
      user.password,
    );

    if (!isMatch) {
      return null;
    }
    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, id: user.id };
    return {
      user: {
        email: user.email,
        id: user.id,
        fullName: user.fullName,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async forwardPassword(data: ForwardPasswordAuthDto) {
    return await this.usersService.forwardPassword(data);
  }

  async forwardPasswordVerifyCode(data: ForwardPasswordActivationCodedAuthDto) {
    return await this.usersService.forwardPasswordVerifyCode(data);
  }
}
