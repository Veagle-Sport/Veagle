import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { MathcRepo } from './match.repo';
import mongoose from 'mongoose';
import { Match, MatchSchema } from './schena/match.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }])],
  controllers: [MatchController,NotificationService],
  providers: [MatchService,MathcRepo],
})
export class MatchModule {}
