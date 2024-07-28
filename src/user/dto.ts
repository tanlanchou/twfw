// create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsNumber,
  MinLength,
  Min,
  Max,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";

export class CreateUserDto {
  @IsString()
  Nickname: string;

  @IsEmail()
  @IsOptional()
  Email?: string;

  @IsString()
  @IsOptional()
  PhoneNumber?: string;

  @IsDate()
  RegistrationDate: Date;

  @IsDate()
  LastLoginTime: Date;

  @IsNumber()
  Status: number;

  @IsString()
  @MinLength(6)
  Password: string;

  @IsString()
  @IsOptional()
  IPAddress?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class PaginationDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit: number;
}
