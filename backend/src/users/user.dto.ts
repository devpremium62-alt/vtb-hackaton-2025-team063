import {IsString, IsPhoneNumber, IsOptional, MaxLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UserDTO {
    @ApiProperty({example: 'Олег', description: 'Имя пользователя'})
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({example: '+7 (999) 999-99-99', description: 'Номер телефона'})
    @IsPhoneNumber("RU")
    phone: string;

    @ApiProperty({example: "data:image/png;base64,...", description: 'Изображение в кодировке base64'})
    @IsString()
    avatar: string;

    @ApiProperty({nullable: true, description: 'Код приглашения для формирования семьи'})
    @IsString()
    @IsOptional()
    familyCode?: string;
}

export class UserCreateDTO extends UserDTO {
    @IsOptional()
    partner?: number;
}

export class UserEditDTO {
    @ApiProperty({nullable: true, example: 'Олег', description: 'Имя пользователя'})
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name?: string;

    @ApiProperty({nullable: true, example: '+7 (999) 999-99-99', description: 'Номер телефона'})
    @IsPhoneNumber("RU")
    @IsOptional()
    phone?: string;
}

export class UserLoginDTO {
    @ApiProperty({example: '+7 (999) 999-99-99', description: 'Номер телефона'})
    @IsPhoneNumber("RU")
    phone: string;
}