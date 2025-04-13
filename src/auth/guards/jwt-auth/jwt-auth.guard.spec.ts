import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with "jwt" strategy (has canActivate method)', () => {
    expect(typeof guard.canActivate).toBe('function'); // ✅ key method from AuthGuard
  });
});
