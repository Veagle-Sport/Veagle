import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PaginationPipe } from '../../common/pipes/pagination.pipe';
import { QueryString } from '../../common/types/queryString.type';
 
 import { ParseMongoIdPipe } from '../../common/pipes/parse-mongodb-id.pipe';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
 
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
 
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }
   @Get()
   @UseGuards(AuthGuard)
  findAll( @Query(new PaginationPipe())   { fields, limit, queryStr, skip, sort, page }: QueryString) {
     
    return this.playerService.findAll( { fields, limit, queryStr, skip, sort, page });
  }

  @Get(':id')
 async findOne(@Param('id',ParseMongoIdPipe ) id: string) {
      return this.playerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseMongoIdPipe) id: string, @Body() updatePlayerDto: UpdatePlayerDto) {

    return this.playerService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseMongoIdPipe) id: string) {
    console.log(this.playerService.remove(id))
    return this.playerService.remove(id);
  }
 
}
