import { resolve } from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '~/core/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        resolve(process.cwd(), '../../.env'),
        resolve(__dirname, '../../../.env'),
      ],
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
