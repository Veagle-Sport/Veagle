import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourtAdminSchema, GenericUserSchema, TalentSeekerSchema, User, UserSchema, UserType, VealgeAdminSchema } from '../user/schema/schema';
 import { AuthRepo } from './auth.repo';
import { SignUpStratgies } from './straigies/signup';
 
@Module({
   imports: [MongooseModule.forFeatureAsync([
       {
         name: User.name,
         useFactory: () => {
           const schema = UserSchema;
           schema.discriminator( UserType.TALENT_SEEKER, TalentSeekerSchema);
           schema.discriminator( UserType.COURT_ADMIN, CourtAdminSchema);
           schema.discriminator( UserType.VEALGE_ADMIN, VealgeAdminSchema);
           schema.discriminator( UserType.GenericUser, GenericUserSchema);
           return schema;
         },
       },
     ]),],
  controllers: [AuthController],
  providers: [AuthService,AuthRepo,SignUpStratgies],

})
export class AuthModule {}
