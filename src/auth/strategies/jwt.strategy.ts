// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    
  constructor(private configService: ConfigService) {
    console.log('JWT Strategy initialized', ExtractJwt.fromAuthHeaderAsBearerToken()); // Log for debugging purposes
    const secret = configService.get('JWT_SECRET') || 'default_secret_key';
    const jwtFromRequest = (req) => {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        console.log('JWT Token:', token, 'Secret:', secret); // Log the token and secret for debugging purposes
        return token;
      };
    super({
        jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'default_secret_key',
    });
  }

  async validate(payload: any) {
    // This method attaches user info to the request object.
    return { userId: payload.email, username: payload.firstName };
  }
}
