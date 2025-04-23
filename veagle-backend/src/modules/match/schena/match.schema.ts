import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type MatchDocument = Match & Document;

@Schema()
export class Match extends Document {
  @Prop({ default: Date.now })
  matchDate: Date;

  @Prop({ enum: ['sunny', 'rainy', 'cloudy', 'snowy'], default: 'sunny' })
  weather: string;

  @Prop({ default: 'day' })
  timeOfDay: string;

  @Prop({ default: '' })
  originalVideo: string;

  @Prop({ default: '' }) 
  analyzedVideo: string;

  @Prop({ default: '' })
  playersImage: string;

  @Prop({ default: 0 })
  passes: number;

  @Prop({ default: 0 })
  shotsOnGoal: number;

  @Prop({ default: 0 })
  corners: number;

  @Prop({ default: 0 })
  saves: number;

  @Prop({ default: 0 })
  goals: number;

  @Prop({ default: 0 })
  fouls: number;

  @Prop({ default: 25 })
  NumberOfPlayers: number;

  @Prop({ type: Boolean, default: true })
  cleanSheets: boolean;

  @Prop({
    default: [],
  
  })
  playersStats: {
    AIModelId: number;
    playerId: Types.ObjectId | string;
    stats: Record<string, any>;
  }[];
}

export const MatchSchema = SchemaFactory.createForClass(Match);

 

// PRE-UPDATE hook
MatchSchema.pre('updateOne', function (next) {
  const update = this.getUpdate() as any;

  if (typeof update.goals === 'number') {
    update.cleanSheets = update.goals === 0;
  }

  next();
});
