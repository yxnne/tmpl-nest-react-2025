import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from '../common/modules/auth/jwt.strategy.js';
import { User } from '../user/user.entity.js';

function parseExpires(input: string): number {
  const m = input.trim().match(/^(\d+)\s*([smhd])?$/i);
  if (!m) return 7200; // 默认 2 小时
  const val = parseInt(m[1], 10);
  const unit = (m[2] || 's').toLowerCase();
  switch (unit) {
    case 's':
      return val;
    case 'm':
      return val * 60;
    case 'h':
      return val * 60 * 60;
    case 'd':
      return val * 60 * 60 * 24;
    default:
      return val;
  }
}

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const raw = config.get<string | number>('jwt.expiresIn');
        const expiresIn = typeof raw === 'number' ? raw : parseExpires(raw ?? '2h');
        return {
          secret: config.get<string>('jwt.secret') || 'dev-secret-change-me',
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}