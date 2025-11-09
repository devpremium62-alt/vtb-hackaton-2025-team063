import {IsString} from "class-validator";

export class CreateConsentDto {
    @IsString()
    client_id: string;
}