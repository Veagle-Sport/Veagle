import { AuthGuard } from './auth.guard';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { JWTAuthService } from '../../../modules/utils/jwt.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let mockJWTAuthService: Partial<JWTAuthService>;

  beforeEach(() => {
    mockJWTAuthService = {
      VerifyToken: jest.fn(),
    };

    authGuard = new AuthGuard(mockJWTAuthService as JWTAuthService);
  });

  const createMockContext = (authHeader?: string): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization: authHeader,
        },
      }),
    }),
  } as unknown as ExecutionContext);

  it('should throw if no Authorization header', () => {
    const context = createMockContext();
    expect(() => authGuard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw if Authorization header is malformed', () => {
    const context = createMockContext('InvalidHeader');
    expect(() => authGuard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw if token verification fails', () => {
    (mockJWTAuthService.VerifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const context = createMockContext('Bearer fake-token');
    expect(() => authGuard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should allow request and attach userId when token is valid', () => {
    (mockJWTAuthService.VerifyToken as jest.Mock).mockReturnValue({
      payload: {
        _id: 'user123',
      },
    });

    const mockReq: any = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockReq,
      }),
    } as unknown as ExecutionContext;

    const result = authGuard.canActivate(context);
    expect(result).toBe(true);
    expect(mockReq.userId).toBe('user123');
  });
});
