import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @MaxLength(34, {
    message: 'Tên không được vượt quá 34 ký tự',
  })
  fullName: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, {
    message: 'Mật khẩu ít nhất phải có 6 ký tự',
  })
  password: string;
}

export class VerifyCodeAuthDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Mã kích hoạt không được để trống' })
  activationCode: string;
}

export class ResendCodeAuthDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;
}

export class LoginAuthDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  password: string;
}

export class ForwardPasswordAuthDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;
}
