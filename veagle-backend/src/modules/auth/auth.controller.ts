import { Body, Controller, Get, Param, Post,  Query,  Req,  Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
 import { CreateUserDto } from '../user/dto/create-user.dto';
import { Response ,Request} from 'express';
 import { SignUpGuard } from 'src/common/guards/signup-guard/signup-guard.guard';
 import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';
import { AccessInterceptor } from 'src/common/interpcetors/auth/Access.interceptor';
 import { RefreshGuard } from 'src/common/guards/refresh/refresh.guard';
 
@Controller('auth')
export class AuthController  {
  constructor(private readonly authService: AuthService) {

  }
 
 
  @Post('signup')
  @UseGuards(SignUpGuard)
  @UseInterceptors(AccessInterceptor) 
   async singnUp(@Body()CreateUserDto:CreateUserDto   ) { {
    const {authToken,refreshToken}= await this.authService.signUp(CreateUserDto);
  return {authToken,refreshToken} 
  
 }}
 @Post('signup/magic-link')
 @UseGuards(SignUpGuard)
   async singnUpWithMagicLink(@Body()CreateUserDto:CreateUserDto  ) {  
  
   const userEmail= await this.authService.signUp(CreateUserDto,'magicLink')
  
//send email here
return userEmail
   }

   @Post('signin')
   @UseInterceptors(AccessInterceptor)
  async signIn(@Body(){email,password}:Partial <CreateUserDto>) {
     const {authToken,refreshToken}   = await this.authService.signIn({email,password});
  return{authToken,refreshToken} 
    
   }

   @Post('signout')
   async signOut(@Query('userId') userId: MongoDbId, @Res() res: Response) {
     console.log('User ID:', userId);   
     await this.authService.signOut(userId);   
     res.clearCookie('authToken');
     res.clearCookie('refreshToken');
     return res.status(200).json({ message: 'signout success' });
   }


  @UseGuards(RefreshGuard)
@Post('/refresh')
@UseInterceptors(AccessInterceptor)
async refresh( @Req() req:Request) {
     

 
  return await this.authService.generateTokens(req['userId'],  req.cookies.refreshToken);
     
 
}
}