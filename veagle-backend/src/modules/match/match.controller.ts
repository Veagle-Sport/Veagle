import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile,   } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { QueryString } from 'src/common/types/queryString.type';
import {  PlayerStatsDtoArray } from './dto/Player-stats-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoPipe } from 'src/common/pipes/video-upload.pipe';
import { Subscriber } from 'rxjs/internal/Subscriber';
 
import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';
 
@Controller('matchs')
export class MatchController {
  private clients: Subscriber<any>[] = [];

  constructor(private readonly matchService: MatchService) {}

  @Post()
  @UseInterceptors(FileInterceptor('originalVideo'))
  create(@Body() createMatchDto: CreateMatchDto,@UploadedFile(new VideoPipe()) videoUrl: string) {
    createMatchDto.originalVideo = videoUrl||'';
   
      
    return this.matchService.create(createMatchDto);
  }

  @Get()
  findAll(@Query(new PaginationPipe()){fields,limit,queryStr,skip,sort,page}:QueryString) {
    return this.matchService.findAll({fields,limit,queryStr,skip,sort,page});
  }
 
  @Get(':id')
  findOne(@Param('id') id: MongoDbId) {
    return this.matchService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: MongoDbId, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchService.update(id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchService.remove(id);
  }
  @Patch(':matchId/players')
  addPlayers(@Param('matchId') matchId: string, @Body() {playersStats}: PlayerStatsDtoArray) {
 
    return this.matchService.addPlayers(matchId, playersStats as any);
  }

  

}
