import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ForwardPasswordActivationCodedAuthDto,
  ForwardPasswordAuthDto,
  RegisterAuthDto,
  ResendCodeAuthDto,
  VerifyCodeAuthDto,
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

  async sendActivationEmail(user: User, activationCode: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Mã xác nhận của bạn',
      template: 'accountActivation',
      context: {
        fullName: user.fullName,
        activationCode: activationCode,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email: email },
    });
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

  async comparePassword(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
  }

  async register(data: RegisterAuthDto) {
    // Check email
    await this.checkEmailExist(data.email);
    // Hash password
    const newPassword = await this.hashPassword(data.password);
    // Create and save
    const activationCode = this.generateCode();
    const user = this.usersRepository.create({
      email: data.email,
      fullName: data.fullName,
      password: newPassword,
      isActive: false,
      activationCode: activationCode,
      codeExpired: dayjs().add(5, 'minutes').toDate(),
    });
    await this.usersRepository.save(user);
    // Send email
    await this.sendActivationEmail(user, activationCode);
    return {
      id: user.id,
    };
  }

  async resendCode(data: ResendCodeAuthDto) {
    // Find user by email
    const user = await this.findUserByEmail(data.email);

    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }

    // Check isActive?
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    // Tạo và save code mới
    const activationCode = this.generateCode();
    user.activationCode = activationCode;
    user.codeExpired = dayjs().add(5, 'minutes').toDate();
    await this.usersRepository.save(user);
    // Send email
    await this.sendActivationEmail(user, activationCode);

    return {
      id: user.id,
    };
  }

  async verifyCode(data: VerifyCodeAuthDto) {
    // Find user by email
    const user = await this.findUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException('Email không tồn tại.');
    }
    // Check isActive?
    if (user.isActive) {
      throw new BadRequestException('Tài khoản đã được kích hoạt');
    }

    // Check expired date
    const isExpired = dayjs().isAfter(user.codeExpired);
    if (isExpired) {
      console.log(isExpired);
      throw new BadRequestException('Mã kích hoạt đã hết hạn');
    }

    // Check code
    if (user.activationCode !== data.activationCode) {
      throw new BadRequestException('Mã kích hoạt không kích xác');
    }

    // Update and save
    user.isActive = true;
    user.activationCode = null;
    user.codeExpired = null;
    await this.usersRepository.save(user);

    return {
      id: user.id,
    };
  }

  async forwardPassword(data: ForwardPasswordAuthDto) {
    // Check email
    const user = await this.findUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }

    // Update user
    const activationCode = this.generateCode();
    user.activationCode = activationCode;
    user.codeExpired = dayjs().add(5, 'minutes').toDate();
    await this.usersRepository.save(user);

    // Send email
    await this.sendActivationEmail(user, activationCode);

    return {
      id: user.id,
      email: user.email,
    };
  }

  async forwardPasswordVerifyCode(data: ForwardPasswordActivationCodedAuthDto) {
    // Check email
    const user = await this.findUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }

    // Check expired date
    const isExpired = dayjs().isAfter(user.codeExpired);
    if (isExpired) {
      throw new BadRequestException('Mã kích hoạt đã hết hạn');
    }
    // Check code
    if (user.activationCode !== data.activationCode) {
      throw new BadRequestException('Mã kích hoạt không chính xác');
    }

    // Hash password
    const newPassword = await this.hashPassword(data.password);
    // Update and save
    user.password = newPassword;
    user.activationCode = null;
    user.codeExpired = null;
    await this.usersRepository.save(user);
    return {
      id: user.id,
    };
  }
}
