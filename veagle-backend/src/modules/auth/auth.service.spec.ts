import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "../user/schema/schema";
import { getModelToken } from "@nestjs/mongoose";
import { AuthRepo } from "./auth.repo";
import { JWTAuthService } from "../utils/jwt.service";
import { SignUpStratgies } from "./straigies/signup";

describe('AuthService', () => {
  let authService: AuthService;

  const mockAuthRepo = {};
  const mockJWTAuthService = {};
  const mockSignUpStratgies = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JWTAuthService, useValue: mockJWTAuthService },
        { provide: AuthRepo, useValue: mockAuthRepo },
        { provide:  SignUpStratgies, useValue: mockSignUpStratgies },
        { provide: getModelToken(User.name), useValue: {} },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

 
});
