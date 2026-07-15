import { Module } from '@nestjs/common';

import { AuthController } from '~/core/auth/auth.controller';
import { AuthService } from '~/core/auth/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
