import { PartialType } from '@nestjs/mapped-types';
import { RegisterAuthDto } from 'src/modules/auth/dto/auth.dto';

export class UpdateAuthDto extends PartialType(RegisterAuthDto) {}
