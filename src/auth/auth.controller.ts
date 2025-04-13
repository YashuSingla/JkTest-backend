// src/auth/auth.controller.ts
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ---------- Google OAuth2 Endpoints ----------
  @Post('google')
  async googleLogin(@Body('token') token: string) {
    const user = await this.authService.verifyGoogleToken(token);
    const jwt = this.authService.generateJwt(user);
    return { token: jwt };
  }
}
