import { IsString, IsPhoneNumber, IsOptional } from 'class-validator';

export class UserDTO {
    @IsString()
    name: string;

    @IsPhoneNumber("RU")
    phone: string;

    @IsString()
    avatar: string;

    @IsString()
    @IsOptional()
    familyCode?: string;
}

export class UserLoginDTO {
    @IsPhoneNumber("RU")
    phone: string;
}