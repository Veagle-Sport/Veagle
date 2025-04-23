import { Injectable, ConsoleLogger } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayerRepo } from './palyer.repo';
import { QueryString } from '../../common/types/queryString.type';
import {   QueryConstructorPipe } from '../../common/pipes/query-constructor.pipe/query-constructor.pipe';
import { ConstructOrQuery } from 'src/common/pipes/query-constructor.pipe/quries';

@Injectable()
export class PlayerService {
  constructor(private readonly PlayerRepo:PlayerRepo,
    private readonly queryConstructorPipe: QueryConstructorPipe<Record<string, any>>,
  ){}
  create(createPlayerDto: CreatePlayerDto) {
     

    const filterObj :Record<string, any>=this. queryConstructorPipe.transform({strategy:new ConstructOrQuery(),queryObj:{email:createPlayerDto.email,phone:createPlayerDto.phone}});
  
 if(!this.PlayerRepo.exists(filterObj)) throw new ConsoleLogger('Player already exists');
    return this.PlayerRepo.create(createPlayerDto);}

  findAll({fields,limit,queryStr,skip,sort,page}:QueryString) {
    
    return  this.PlayerRepo.find({fields,limit,queryStr,skip,sort,page});
  }

async  findOne(id: string) {
    return  await this.PlayerRepo.findOneById(id)
  }

 async update(id: string, updatePlayerDto: UpdatePlayerDto) {
    return  await this.PlayerRepo.findOneAndUpdate({_id:id},updatePlayerDto);
  }

  remove(id: string) {
    return  this.PlayerRepo.deleteOne(id);
  }
}
