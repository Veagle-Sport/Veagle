import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerDto } from './create-player.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';
import { PlayerType } from '../schema/player.schema';

export class UpdatePlayerDto {
   @ApiProperty({required:false})
     @IsNotEmpty()
     @IsString()
   @IsDefined()
   @IsNotEmpty()
   @IsOptional()
   @Length(4,20)
     firstName?: string;

     @ApiProperty({required:false})
     @IsOptional()
   @IsString()
   @IsNotEmpty()
    // @IsPhoneNumber('SA')
   phone?:string
   @ApiProperty({required:false})
   @IsNotEmpty()
   @IsString()
   @IsDefined()
   @IsNotEmpty()
   @Length(4,20)
   @IsOptional()
     lastName?: string;
   
     @IsNotEmpty()
     @IsEmail()
     @IsOptional()
     @ApiProperty({required:false})
     email?: string;
   
     @ApiProperty({required:false})
        @IsOptional()
     @IsNotEmpty()  
     @IsEnum(PlayerType)
     type?: PlayerType;
   
    
}
