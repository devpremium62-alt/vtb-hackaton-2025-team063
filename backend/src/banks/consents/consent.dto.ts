import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateConsentDto {
    @ApiProperty({example: 'team###-1', description: 'Идентификатор клиента банка'})
    @IsString()
    client_id: string;
}