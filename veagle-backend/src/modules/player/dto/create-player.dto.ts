import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsEmail, ValidateIf, IsDefined, Length, IsPhoneNumber } from 'class-validator';
import { PlayerType } from '../schema/player.schema';
import { ApiProduces, ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto     {
 @ApiProperty()
  @IsNotEmpty()
  @IsString()
@IsDefined()
@IsNotEmpty()
@Length(4,20)
  firstName: string;

@IsString()
@IsNotEmpty()
//  @IsPhoneNumber('SA')
phone:string

@IsNotEmpty()
@IsString()
@IsDefined()
@IsNotEmpty()
@Length(4,20)
  
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
   
  email: string;

 

  @IsNotEmpty()  
  @IsEnum(PlayerType)
  type: PlayerType;

  @IsOptional()
  @IsNumber()
  
  passes?: number;
}

export class CreateOutFielderDto extends CreatePlayerDto {
  @ValidateIf((obj) => obj.type === PlayerType.OUT_FIELDER)  
  @IsNotEmpty()
  @IsNumber()
  shotsOnGoal: number;

  @ValidateIf((obj) => obj.type === PlayerType.OUT_FIELDER)
  @IsNotEmpty()
  @IsNumber()
  goals: number;

  @ValidateIf((obj) => obj.type === PlayerType.OUT_FIELDER)
  @IsNotEmpty()
  @IsNumber()
  speed: number;

  @ValidateIf((obj) => obj.type === PlayerType.OUT_FIELDER)
  @IsNotEmpty()
  @IsString()
  maxSpeed: string;
}

export class CreateGoalKeeperDto extends CreatePlayerDto {
  @ValidateIf((obj) => obj.type === PlayerType.GOAL_KEEPER) 
  @IsNotEmpty()
  @IsNumber()
  saves: number;
}

