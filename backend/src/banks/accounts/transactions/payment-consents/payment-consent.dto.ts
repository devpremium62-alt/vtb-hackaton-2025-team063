import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsOptional, IsString, Max, Min} from "class-validator";

export class PaymentConsentDTO {
    @ApiProperty({example: 10000, description: 'Сумма разрешения'})
    @IsNumber()
    @Min(1)
    @Max(100000000)
    amount: number;

    @ApiProperty({example: "40817810099910004312", description: 'Cчета отправителя'})
    @IsString()
    fromAccount: string;

    @ApiProperty({example: "abank", description: 'Идентификатор банка отправителя'})
    @IsString()
    fromBankId: string;

    @ApiProperty({example: "4230156e885ea205641c", description: 'Cчет получателя'})
    @IsString()
    @IsOptional()
    toAccount?: string;

    @ApiProperty({example: "Иван Иванов", description: 'Имя получателя'})
    @IsString()
    @IsOptional()
    toName?: string;

    @ApiProperty({example: "Оплата услуг", description: 'Комментарий'})
    @IsString()
    @IsOptional()
    reference?: string;
}