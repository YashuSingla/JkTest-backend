// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { User } from 'user/entities/user.entity';
import { UserService } from 'user/user.service';


@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService, // ✅ Inject UserService
  ) {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

    if (!googleClientId) {
      throw new Error('Missing GOOGLE_CLIENT_ID configuration.');
    }

    this.googleClient = new OAuth2Client(googleClientId);
  }

  async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
  
      const payload = ticket.getPayload();
  
      if (!payload) {
        throw new UnauthorizedException('Invalid Google Token: no payload');
      }
  
      return {
        email: payload.email ?? '',
        firstName: payload.given_name ?? '',
        lastName: payload.family_name ?? '',
        picture: payload.picture ?? '',
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid Google Token');
    }
  }
  

  async loginWithGoogle(profile: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }): Promise<User> {
    
    const user = await this.userService.findOrCreateUser({
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      picture: profile.picture,
    });
  
    return user;
  }
  

  generateJwt(user: User): string {
    
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
    });
    // you can sign { id, email } etc.
  }
}
