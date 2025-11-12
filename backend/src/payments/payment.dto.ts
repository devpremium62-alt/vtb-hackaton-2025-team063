import {IsString, MaxLength, IsNumber, Max, Min, IsDateString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {IsFutureDate} from "../common/decorators/is-future-date.decorator";

export class PaymentDTO {
    @ApiProperty({example: 'На квартиру', description: 'Название платежа'})
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({example: 7000, description: 'Сумма платежа'})
    @IsNumber()
    @Min(1)
    @Max(10000000)
    value: number;

    @ApiProperty({example: 1, description: 'Идентификатор категории'})
    @IsNumber()
    category: number;

    @ApiProperty({example: "2025-11-11", description: 'Дата платежа'})
    @IsDateString()
    @IsFutureDate({ message: 'Дата платежа должна быть позже текущего момента' })
    date: string;
}