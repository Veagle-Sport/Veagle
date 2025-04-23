import { Injectable } from '@nestjs/common';
 
import { BaseRepository } from '../../common/repositories/base.abstract.reposatory';
import { Player, PlayerDocument } from './schema/player.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayerRepo extends BaseRepository<PlayerDocument> {
    constructor(@InjectModel(Player.name) private readonly playerModel: Model<PlayerDocument>) {
    
        super(playerModel);
      }
 
}
