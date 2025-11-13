import {IsString, MaxLength, IsNumber, Max, Min, IsDateString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {IsFutureDate} from "../../../common/decorators/is-future-date.decorator";

export class GoalDTO {
    @ApiProperty({example: 'Путешествие', description: 'Название цели'})
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({example: 200000, description: 'Сумма цели'})
    @IsNumber()
    @Min(1)
    @Max(10000000)
    value: number;

    @ApiProperty({example: "2025-11-11", description: 'Дата платежа'})
    @IsDateString()
    @IsFutureDate({ message: 'Дата платежа должна быть позже текущего момента' })
    date: string;

    @ApiProperty({example: "vacation", description: 'Иконка цели'})
    @IsString()
    icon: string;

    @ApiProperty({example: "abank", description: 'Идентификатор банка'})
    @IsString()
    bankId: string;
}