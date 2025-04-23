import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsNumber, ValidateNested } from "class-validator";

export class PlayerStatsDto {
  @ApiProperty({
    description: 'The AI model identifier used to map the player.',
    example: 1,
    type: Number,
  })
  @IsNumber()
  AIModelId: number;

  @ApiProperty({
    description: 'The MongoDB ObjectId of the player.',
    example: '',
    type: String,
  })
  @IsMongoId()
  playerId: string;
}

export class PlayerStatsDtoArray {
  @ApiProperty({
    description: 'Array of player stats mapped by AI model IDs.',
    type: [PlayerStatsDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerStatsDto)
  playersStats: PlayerStatsDto[];
}
