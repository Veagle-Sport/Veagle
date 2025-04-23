import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PlayerRepo } from './palyer.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalKeeperSchema, OutFielderSchema, Player, PlayerSchema,  } from './schema/player.schema';
 
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Player.name,
        useFactory: () => {
          const schema = PlayerSchema;
          schema.discriminator('outFielder', OutFielderSchema);
          schema.discriminator('goalKeeper', GoalKeeperSchema);
          return schema;
        },
      },
    ]),
  ],
  controllers: [PlayerController],
  providers: [PlayerService,PlayerRepo]
  ,exports: [PlayerRepo,PlayerService],
})
export class PlayerModule {}
