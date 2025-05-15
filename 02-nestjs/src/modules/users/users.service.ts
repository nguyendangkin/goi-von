import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import {
  RegisterAuthDto,
  CodeVerifyAuthDto,
} from 'src/modules/auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async codeVerify(data: CodeVerifyAuthDto) {
    // Check user by email
    const user = await this.usersRepository.findOne({
      where: { email: data.email },
    });
    if (!user) {
      throw new BadRequestException('Email không tồn tại.');
    }
    // Check isActive?
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }
    // Check code
    if (user.activeCode !== data.activeCode) {
      throw new BadRequestException('Mã kích hoạt không kích xác');
    }

    // Check expired date
    const isExpired = dayjs().isBefore(user.codeExpired);
    if (isExpired) {
      throw new BadRequestException('Mã kích hoạt đã hết hạn');
    }

    // Update and save
    user.isActive = true;
    user.activeCode = null;
    user.codeExpired = null;
    await this.usersRepository.save(user);

    return {
      message: 'Tài khoản kích hoạt thành công',
    };
  }

  async checkEmailExist(email: string) {
    const result = await this.usersRepository.exists({
      where: { email },
    });
    if (result === true) {
      throw new BadRequestException('Email đã tồn tại');
    }
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async register(data: RegisterAuthDto) {
    // Check email
    await this.checkEmailExist(data.email);
    // Hash password
    const newPassword = await this.hashPassword(data.password);
    // Create and save
    const activeCode = this.generateCode();
    const user = this.usersRepository.create({
      email: data.email,
      fullName: data.fullName,
      password: newPassword,
      isActive: false,
      activeCode: activeCode,
      codeExpired: dayjs().add(5, 'minutes'),
    });
    await this.usersRepository.save(user);
    // Send email
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Kích hoạt tài khoản của bạn',
      template: 'sendEmailCode',
      context: {
        fullName: user.fullName,
        activeCode: activeCode,
      },
    });
    return {
      message: 'Đăng ký tài khoản thành công, vui lòng kích hoạt',
      id: user.id,
    };
  }
}
