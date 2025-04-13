import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

// Reuse the same mock function in all tests
const verifyIdTokenMock = jest.fn();

jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: verifyIdTokenMock
    }))
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockJwt = 'mocked-jwt-token';
  const mockPayload = {
    email: 'test@example.com',
    given_name: 'Test',
    family_name: 'User',
    picture: 'https://example.com/pic.jpg'
  };

  beforeEach(async () => {
    verifyIdTokenMock.mockReset(); // reset before each test

    const jwtServiceMock = {
      sign: jest.fn().mockReturnValue(mockJwt)
    };

    const configServiceMock = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'GOOGLE_CLIENT_ID') return 'fake-google-client-id';
        return null;
      })
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: ConfigService, useValue: configServiceMock }
      ]
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should verify a valid Google token and return user data', async () => {
    const mockTicket = {
      getPayload: jest.fn().mockReturnValue(mockPayload)
    };

    verifyIdTokenMock.mockResolvedValue(mockTicket);

    const user = await service.verifyGoogleToken('valid-google-token');

    expect(verifyIdTokenMock).toHaveBeenCalledWith({
      idToken: 'valid-google-token',
      audience: 'fake-google-client-id'
    });

    expect(user).toEqual({
      email: mockPayload.email,
      firstName: mockPayload.given_name,
      lastName: mockPayload.family_name,
      picture: mockPayload.picture
    });
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    verifyIdTokenMock.mockRejectedValue(new Error('Invalid token'));

    await expect(service.verifyGoogleToken('invalid-token')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if payload is missing', async () => {
    const mockTicket = {
      getPayload: jest.fn().mockReturnValue(null)
    };

    verifyIdTokenMock.mockResolvedValue(mockTicket);

    await expect(service.verifyGoogleToken('token')).rejects.toThrow(UnauthorizedException);
  });

  it('should generate a JWT using jwtService.sign()', () => {
    const user = { email: 'test@example.com' };
    const token = service.generateJwt(user);

    expect(jwtService.sign).toHaveBeenCalledWith(user);
    expect(token).toBe(mockJwt);
  });
});
