import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "src/common/repositories/base.abstract.reposatory";
import { Match } from "./schena/match.schema";

@Injectable()
export class MathcRepo extends BaseRepository<Match> {
  constructor(@InjectModel  ('Match') private readonly matchModel: Model<Match>) {
    super(matchModel);
  }
   

}