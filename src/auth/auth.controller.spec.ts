import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = { id: '123', email: 'test@example.com' };
  const mockJwt = 'mocked-jwt-token';

  const authServiceMock = {
    verifyGoogleToken: jest.fn().mockResolvedValue(mockUser),
    generateJwt: jest.fn().mockReturnValue(mockJwt)
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should verify Google token and return a JWT', async () => {
    const result = await controller.googleLogin('test-google-token');

    expect(authService.verifyGoogleToken).toHaveBeenCalledWith('test-google-token');
    expect(authService.generateJwt).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual({ token: mockJwt });
  });
});
