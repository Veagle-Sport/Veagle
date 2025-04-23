import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../common/repositories/base.abstract.reposatory";
import { User, UserDocument } from '../user/schema/schema';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class AuthRepo extends BaseRepository<UserDocument> {
    constructor( @InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
        super(userModel);
    }
}