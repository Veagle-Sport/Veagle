import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsArray,
    ValidateNested,
    IsMongoId,
  } from 'class-validator';
  import { Type } from 'class-transformer';
import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
  
  
  export class CreateMatchDto {
 
    // @IsOptional()
    // @IsEnum(['sunny', 'rainy', 'cloudy', 'snowy'])
    // weather: string;
  @IsOptional()
    @IsString()
    timeOfDay: string;
  
  
  
    @IsString()
    @IsOptional()
    originalVideo: string;
   
  
   
  
   
  // @IsNumber()
  // @Type(() => Number)
  // @ApiProperty({example: 25})
  // NumberOfPlayers: number;
  
  
  
  }