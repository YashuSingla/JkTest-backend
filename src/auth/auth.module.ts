// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'user/entities/user.entity';
import { Post } from 'posts/entities/post.entity/post.entity';
import { UserService } from 'user/user.service';



@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Post]),
    ConfigModule, // To load environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'default_secret_key',
        signOptions: { expiresIn: '4h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService],
})
export class AuthModule {}
