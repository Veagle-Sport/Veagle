import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MathcRepo } from './match.repo';
import { QueryString } from 'src/common/types/queryString.type';
 import { PlayerStatsDto } from './dto/Player-stats-dto';
import {  QueryConstructorPipe    } from 'src/common/pipes/query-constructor.pipe/query-constructor.pipe';
import { UpdatePlayersStatsArrayByAIModelIdStrategy } from 'src/common/pipes/query-constructor.pipe/mutations';
import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';
 
@Injectable()
export class MatchService {
constructor(private readonly matchRepo:MathcRepo
  , private readonly queryConstructorPipe: QueryConstructorPipe<Record<string, any>>
) {}
 async create(createMatchDto: CreateMatchDto) {
    if (!await this.matchRepo.exists({ originalVideo: createMatchDto.originalVideo }))  
         return await this.matchRepo.create(createMatchDto as any,);

  }

  findAll({fields, limit, queryStr, skip, sort, page}: QueryString) {
    fields=fields+' -playersStats';
    return this.matchRepo.find({fields, limit, queryStr, skip, sort, page});
  }

  findOne(id: MongoDbId) {
    return  this.matchRepo.findOne({_id: id});
  }

  update(id: MongoDbId, updateMatchDto: UpdateMatchDto) {
    return this.matchRepo.updateOne(id, updateMatchDto as any);
  }

  remove(id: string) {
    return this.matchRepo.deleteOne(id);
  }
 
  async addPlayers(matchId: string, playerIds: PlayerStatsDto[]) {
    const strategy = new UpdatePlayersStatsArrayByAIModelIdStrategy<PlayerStatsDto[]>();
  
    const result = strategy.mutate(playerIds, matchId);
  
     if (!result.updates || !Array.isArray(result.updates)) {
      throw new Error('Invalid update instructions');
    }
  
     return await this.matchRepo.bulkWrite(result.updates);
  }
  
}