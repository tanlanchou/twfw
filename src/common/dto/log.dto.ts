import { IsString, IsNotEmpty, IsEmail, IsIP } from 'class-validator';
import { Action } from "../enum/action"
import { LogStatus } from "../enum/log";
import Platform from "../enum/platform";

export class LogAddDTO {
    @IsString()
    @IsNotEmpty()
    operation: Action;

    @IsString()
    @IsNotEmpty()
    operator: string;


    @IsString()
    @IsNotEmpty()
    platform: Platform;

    @IsNotEmpty()
    timestamp: Date;

    @IsString()
    @IsNotEmpty()
    details: string;

    @IsString()
    @IsNotEmpty()
    status: LogStatus;

    related_id?: number;
}

export class LogListDto {
    operation?: Action;
    operator?: string;
    platform?: Platform;
    startTime?: Date;
    endTime?: Date;
    details?: string;
    status?: LogStatus;
    page: number = 1;
    limit: number = 10;
}