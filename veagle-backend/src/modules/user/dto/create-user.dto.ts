import { Optional } from "@nestjs/common";
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserType } from "../schema/schema";
import {   ApiProperty } from "@nestjs/swagger";
export class CreateUserDto {
    @ApiProperty({example: 'John Doe@example.com'})
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    password?: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    phoneNumber?: string;
 
    @IsNotEmpty()
    @IsString()
    @IsDefined()
    type: UserType;

}
 