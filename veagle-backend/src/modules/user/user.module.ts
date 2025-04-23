import { Module } from '@nestjs/common';
import { UserService } from './user.service';
 import { MongooseModule } from '@nestjs/mongoose';
import { CourtAdminSchema, GenericUserSchema, TalentSeekerSchema, User, UserSchema, UserType, VealgeAdminSchema, VealgeAdmin } from './schema/schema';

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
  controllers: [ ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
