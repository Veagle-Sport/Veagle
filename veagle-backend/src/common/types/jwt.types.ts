import { CreateUserDto } from "src/modules/user/dto/create-user.dto";
import { MongoDbId } from "../DTOS/mongodb-Id.dto";
import { User } from "src/modules/user/schema/schema";

 
export type TokenData = {
  token: string;
  secret: string;
};
export type Token = {
  payload: Payload;
  secret: string;
  expiresIn: string;
};

 
export type Payload = {
  _id?:MongoDbId;
   onlyAllowd?: string [];
};

export type Secrets={
  authSecret:string
   refreshSecret?:string
}