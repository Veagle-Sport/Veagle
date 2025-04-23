import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
 import { GlobalModlue } from './modules/global/global.module';
 import { MatchModule } from './modules/match/match.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UtilsModule } from './modules/utils/utils.module';
import { PlayerModule } from './modules/player/player.module';
   
 
  
@Module({

  imports: [  GlobalModlue.forRoot()   ,  MatchModule, UserModule, AuthModule, UtilsModule ,PlayerModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
