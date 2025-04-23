 
import { Document, Model, FilterQuery } from 'mongoose';
import { BaseRepositoryInterface,   } from './base.interface.reposatireis';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PaginatedData } from '../types/paginateData.type';
import { MongoDbId } from '../DTOS/mongodb-Id.dto';
 
export abstract class BaseRepository<T extends Document> implements BaseRepositoryInterface<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T> ): Promise<T|Error> {
   
  
  
    const createdDocument =  await this.model.create(data);

    if(!createdDocument) throw new InternalServerErrorException(`failed to create  `)

    return createdDocument
  }

  async createMany(data: Partial<T>[], uniqueField: Extract<keyof T, string>): Promise<unknown[]> {
    const identifiers = data.map(item => item[uniqueField]);
  
    const existingRecords = await this.model.find({
      [uniqueField]: { $in: identifiers },
    } as FilterQuery<T>).lean().exec();  
  
     const existingValues = new Set(existingRecords.map(record => (record as Record<string, unknown>)[uniqueField]));
  
    const newData = data.filter(el => !existingValues.has(el[uniqueField]));
  
    if (newData.length === 0) return [];
  
    return await this.model.insertMany(newData);
  }
  
  

async findOneById(id: string): Promise<unknown | Error> {
const exsistingDoc=await this.model.findById(id).lean().exec();
if(exsistingDoc)return exsistingDoc
     
throw new NotFoundException(`we ware not able to find this  `)
  }

async findOne(options: FilterQuery<T>,fileds:string=''): Promise<unknown | null> {
    const exsistingDoc=await this.model.findOne(options).select(fileds).lean().exec();
if(!exsistingDoc) throw new BadRequestException(`Failed to finde`)
    return exsistingDoc
  }

async find({limit, skip, queryStr, fields, sort, page }) :Promise<PaginatedData> {
  const total = await this.count(queryStr);
  const numberOfPages = Math.ceil(total / limit);
    const data= await this.model.find(queryStr).limit(limit).skip(skip).select(fields).sort(sort).lean().exec();

    return {data,numberOfPages ,page}
  }
 async findOneAndUpdate(filter: FilterQuery<T>, updateData: Partial<T>): Promise<unknown | null> {
   const exsistngDocument=await this.model.findOneAndUpdate(filter,updateData,{new:true}).exec()
   if (!exsistngDocument) throw new BadRequestException(`Failed to update`);

    return exsistngDocument
 }
  async updateOne(id: MongoDbId, updateData: Partial<T>): Promise<unknown | null> {
    const updatedDocument=await this.model.findByIdAndUpdate(id, updateData, { new: true }).lean().exec()
    if(!updatedDocument) throw new BadRequestException(`Faild to update  `)
   return updatedDocument
  }

  async updateMany(filter: FilterQuery<T>, updateData: Partial<T>): Promise<number> {
    const result = await this.model.updateMany(filter, updateData) ;
    return result.modifiedCount;  
  }

  async deleteOne(id: string): Promise<T | null> {
    
    const deletedDoc = await this.model.findByIdAndDelete(id);
    if (!deletedDoc) throw new NotFoundException(`  not found`);
    return deletedDoc;
}

  async deleteMany(filter: FilterQuery<T>): Promise<number> {
    const result = await this.model.deleteMany(filter).exec();
    return result.deletedCount || 0;   
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
     return Boolean(await this.model.exists(filter));
}
  async aggregate(pipeline: any[]): Promise<any[]> {
    return this.model.aggregate(pipeline).exec();
  }
  async save(data: Partial<T>): Promise<T> {
    const createdDocument = new this.model(data);
    await createdDocument.save();
    if (!createdDocument) throw new InternalServerErrorException(`Failed to save document`);
    return createdDocument;
  }
  async bulkWrite(operations: any[]): Promise<any> {
    return this.model.bulkWrite(operations);
  }
}

 
