import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForwardPasswordActivationCodedAuthDto,
  ForwardPasswordAuthDto,
  RegisterAuthDto,
  ResendCodeAuthDto,
  VerifyCodeAuthDto,
} from 'src/modules/auth/dto/auth.dto';
import { LocalAuthGuard } from 'src/modules/auth/passport/local-auth.guard';
import { Public, ResponseMessage } from 'src/decorator/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ResponseMessage('Đăng ký tài khoản thành công, vui lòng kích hoạt tài khoản')
  @Public()
  @Post('register')
  register(@Body() data: RegisterAuthDto) {
    return this.authService.register(data);
  }

  @ResponseMessage('Tài khoản kích hoạt thành công')
  @Public()
  @Post('verify-code')
  verifyCode(@Body() data: VerifyCodeAuthDto) {
    return this.authService.verifyCode(data);
  }

  @ResponseMessage('Đã gửi mã kích hoạt đến email của bạn')
  @Public()
  @Post('resend-code')
  resendCode(@Body() data: ResendCodeAuthDto) {
    return this.authService.resendCode(data);
  }

  @ResponseMessage('Đăng nhập thành công')
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ResponseMessage('Đã gửi mã kích hoạt đến email của bạn')
  @Public()
  @Post('forward-password')
  forwardPassword(@Body() data: ForwardPasswordAuthDto) {
    return this.authService.forwardPassword(data);
  }

  @ResponseMessage('Đổi mật khẩu thành công')
  @Public()
  @Post('forward-password-verify-code')
  forwardPasswordVerifyCode(
    @Body() data: ForwardPasswordActivationCodedAuthDto,
  ) {
    return this.authService.forwardPasswordVerifyCode(data);
  }
}
