import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './local.stategy';

@Module({
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  imports: [
    ConfigModule,
    JwtModule.register({
      signOptions: { expiresIn: '60s' },
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
  ],
})
export class AuthModule {}
