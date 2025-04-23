import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Auth } from './interface';
 import { User, } from '../user/schema/schema';
 import { CreateUserDto } from '../user/dto/create-user.dto';
import * as aragon2 from 'argon2';
import { AuthRepo } from './auth.repo';
import { JWTAuthService } from '../utils/jwt.service';
import { MongoDbId } from '../../common/DTOS/mongodb-Id.dto';
import { MagicLinkSignUpStrategy, SignUpStratgies } from './straigies/signup';
    @Injectable()
export   class AuthService  implements Auth  {
    constructor(private readonly AuthRepo:AuthRepo,private readonly JwtService:JWTAuthService,
        private readonly SignUpStratgies:SignUpStratgies
    ){}
 async signUp(CreateUserDto:CreateUserDto,mode='email' ):Promise<any> {
 

switch (mode) {
  case 'magicLink':
    this.SignUpStratgies.setStrategy(new MagicLinkSignUpStrategy(this.AuthRepo));
    return  this.SignUpStratgies.signUp(CreateUserDto)
   
    // return user email
    // send email from the controllers  


  default:
    const newUser = await this.SignUpStratgies.signUp(CreateUserDto);
    return this.issueTokensAndSave(newUser as User);
}}

  async  signIn( {email,password}:any) :Promise<any>{

    const user  = await this.AuthRepo.findOne({email},'+password') as User;
    if(!user) throw new InternalServerErrorException(' wrong email and/or password');
if(!await aragon2.verify(user.password,password))throw new InternalServerErrorException(' wrong email and/or password') 

    return this.  issueTokensAndSave(user)
};
    
 
      async   generateTokens(userId :MongoDbId,incomigRefreshToken:string):Promise<any>{
      
        const user   = await this.AuthRepo.findOne({_id:userId},'+refreshToken')as any ;
        if(!user&&!user.refreshToken) throw new InternalServerErrorException('Please sign in first');
      
      if(!await aragon2.verify(user.refreshToken,incomigRefreshToken))return new UnauthorizedException('please sign in first') 
        return this.  issueTokensAndSave(user)

}

async signOut(userId:MongoDbId):Promise<any>{
     await this.AuthRepo.updateOne(userId ,{refreshToken:''});
    return {message:'signout success'};
}
private async issueTokensAndSave(user: User): Promise<{ authToken: string; refreshToken: string }> {
    
    
    const [authToken, refreshToken] = this.JwtService.generateTokens([
      {
        secret: process.env.AUTH_SECRET as string ,
        expiresIn: '15m',
        payload: {   _id: user['_id'] },
      },
      {
        secret:  process.env.REFRESH_SECRET as string,
        expiresIn: '30d',
        payload: { _id: user['_id']},
      },
    ]);
  
 
    await this.AuthRepo.updateOne(user['_id'], { refreshToken: await aragon2.hash(refreshToken) });
  
    return { authToken, refreshToken };
  }
  
}
