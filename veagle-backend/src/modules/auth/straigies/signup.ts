import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateUserDto } from "../../user/dto/create-user.dto";
import { User } from "../../user/schema/schema";
import { AuthRepo } from "../auth.repo";
import * as argon2 from 'argon2';
import { JWTAuthService } from "../../utils/jwt.service";
 

 export interface ISignUp<TInput> {
  signUp(payload: TInput): Promise<unknown>;
}

 export class EmailPasswordSignUpStrategy implements ISignUp<CreateUserDto> {
  constructor(
    private readonly authRepo: AuthRepo,
    private readonly jwtService: JWTAuthService
  ) {}

  async signUp(createUserDto: CreateUserDto) :Promise<User>   {
    const userExists = await this.authRepo.exists({ email: createUserDto.email });
    if (userExists) {
      throw new InternalServerErrorException('User already exists');
    }

    createUserDto.password = await argon2.hash(createUserDto .password as string);
    const newUser = await this.authRepo.create(createUserDto) as User;

  return  newUser;
}
 }
// Magic link signup strategy
export class MagicLinkSignUpStrategy implements ISignUp<CreateUserDto> {
  constructor(private readonly authRepo: AuthRepo) {}

  async signUp(createUserDto: CreateUserDto): Promise<User["email"]> {
    
      
 if(!await this.authRepo.exists({email:createUserDto.email}))
{   const newUser=  await this.authRepo.create({email:createUserDto.email} ) as User
 return  newUser['email']}
    
  
return createUserDto.email
 
}
}

 @Injectable()
export class SignUpStratgies implements ISignUp<CreateUserDto> {
  private strategy:  EmailPasswordSignUpStrategy|MagicLinkSignUpStrategy;

  constructor(
    private readonly authRepo: AuthRepo,
    private readonly jwtService: JWTAuthService,
  ) {
    this.strategy = new EmailPasswordSignUpStrategy(this.authRepo, this.jwtService);  
  }

  setStrategy(strategy: EmailPasswordSignUpStrategy|MagicLinkSignUpStrategy) {
    this.strategy = strategy;
  }

  async signUp(payload: CreateUserDto): Promise<unknown> {
    return this.strategy.signUp(payload);
  }
}
