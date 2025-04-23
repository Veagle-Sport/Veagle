 
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, model, Mongoose } from 'mongoose';
import slugify from 'slugify';

export type PlayerDocument = Player & Document;

export enum PlayerType {
  GOAL_KEEPER = 'goalKeeper',
  OUT_FIELDER = 'outFielder',
}

@Schema({ timestamps: true, discriminatorKey: 'type'  })
export class Player {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop( )
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ default: 0 })
  passes: number;
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CourtAdmin' })
courtAdminId: string;
  @Prop()
  slug: string;
}

const PlayerSchema = SchemaFactory.createForClass(Player);

 PlayerSchema.pre('save', function (next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    this.slug = slugify(`${crypto.randomUUID().slice(0,5)}/${this.firstName} ${this.lastName}`, );
  }
  next();
});

 
 @Schema()
export class OutFielder extends Player {
  @Prop({ default: 0 })
  shotsOnGoal: number;

  @Prop({ default: 0 })
  goals: number;

  @Prop({ default: '0' })
  maxSpeed: string;

  @Prop({ type: Object, default: {} })
  previousStats: Record<string, any>;
}

const OutFielderSchema = SchemaFactory.createForClass(OutFielder);

 @Schema()
export class GoalKeeper extends Player {
  @Prop({ default: 0 })
  saves: number;

  @Prop({ type: Object, default: {} })
  previousStats: Record<string, any>;
}

const GoalKeeperSchema = SchemaFactory.createForClass(GoalKeeper);

 const PlayerModel = model<PlayerDocument>('Player', PlayerSchema as mongoose.Schema);

const OutFielderModel = PlayerModel.discriminator(
  PlayerType.OUT_FIELDER,
  OutFielderSchema
);
const GoalKeeperModel = PlayerModel.discriminator(
  PlayerType.GOAL_KEEPER,
  GoalKeeperSchema
);

export {
  PlayerSchema,
  PlayerModel,
  OutFielderModel,
  GoalKeeperModel,
  GoalKeeperSchema,
  OutFielderSchema,
};
