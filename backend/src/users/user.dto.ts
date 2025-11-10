import {IsString, IsPhoneNumber, IsOptional, MaxLength} from 'class-validator';

export class UserDTO {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsPhoneNumber("RU")
    phone: string;

    @IsString()
    avatar: string;

    @IsString()
    @IsOptional()
    familyCode?: string;
}

export class UserCreateDTO extends UserDTO {
    @IsOptional()
    partner?: number;
}

export class UserEditDTO {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name?: string;

    @IsPhoneNumber("RU")
    @IsOptional()
    phone?: string;
}

export class UserLoginDTO {
    @IsPhoneNumber("RU")
    phone: string;
}