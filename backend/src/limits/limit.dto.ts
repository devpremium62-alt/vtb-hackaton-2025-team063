import {IsString, MaxLength, IsNumber, Max, Min, IsIn} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class LimitDTO {
    @ApiProperty({example: 'Продукты', description: 'Название лимита'})
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({example: 1000, description: 'Сумма лимита'})
    @IsNumber()
    @Min(1)
    @Max(10000000)
    limit: number;

    @ApiProperty({example: 1, description: 'Идентификатор категории'})
    @IsNumber()
    category: number;

    @ApiProperty({example: "week", description: 'Срок лимита'})
    @IsString()
    @IsIn(["week", "month"])
    period: "week" | "month";
}