// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ discriminatorKey: 'type', timestamps: true })
export class User {
  @Prop( )
  name: string;
  @Prop({default: false})
  Isverfided: boolean;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({    select:false})
  password: string;

 @Prop({default:'',select:false})
 refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

 
@Schema()
export class TalentSeeker extends User {
  @Prop()
  siteId: string;

  @Prop()
  companyName: string;

  @Prop()
  companyDescription: string;
}
export const TalentSeekerSchema = SchemaFactory.createForClass(TalentSeeker);

@Schema()
export class CourtAdmin extends User {
  @Prop()
  siteId: string;
}
export const CourtAdminSchema = SchemaFactory.createForClass(CourtAdmin);

@Schema()
export class VealgeAdmin extends User {
  @Prop()
  VealgeId: string;

  @Prop({ enum: ['superAdmin'] })
  role: string;
}
export const VealgeAdminSchema = SchemaFactory.createForClass(VealgeAdmin);

@Schema({ _id: false })
class SharePayersData {
  @Prop({ required: true })
  aggrement: string;

  @Prop({ required: true })
  accept: boolean;
}
const SharePayersDataSchema = SchemaFactory.createForClass(SharePayersData);

@Schema()
export class GenericUser extends User {
  @Prop({ type: SharePayersDataSchema })
  sharePayersData: SharePayersData;
}
export const GenericUserSchema = SchemaFactory.createForClass(GenericUser);

export enum UserType {
  VEALGE_ADMIN = 'vealge_admin',
  COURT_ADMIN = 'court_admin',
  TALENT_SEEKER = 'talent_seeker',
  GenericUser = 'generic_user',
}

// -------------------- ENUM -------------------- //
UserSchema.discriminator(UserType.TALENT_SEEKER, TalentSeekerSchema);
UserSchema.discriminator(UserType.COURT_ADMIN, CourtAdminSchema);
UserSchema.discriminator(UserType.VEALGE_ADMIN, VealgeAdminSchema);
UserSchema.discriminator(UserType.GenericUser, GenericUserSchema);
