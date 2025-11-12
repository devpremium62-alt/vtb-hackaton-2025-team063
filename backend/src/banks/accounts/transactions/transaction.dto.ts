import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsOptional, IsString, Max, Min} from "class-validator";
import {NotEqualFields} from "../../../common/decorators/not-equal-fields.decorator";

export class UpdateTransactionDTO {
    @ApiProperty({example: 1, description: 'Идентификатор категории'})
    @IsNumber()
    categoryId: number;
}

export class TransactionDTO {
    @ApiProperty({example: 10000, description: 'Сумма транзакции'})
    @IsNumber()
    @Min(1)
    @Max(100000000)
    amount: number;

    @ApiProperty({example: "acc-1721", description: 'ID счета отправителя'})
    @IsString()
    @NotEqualFields('toAccountId')
    fromAccountId: string;

    @ApiProperty({example: "40817810099910004312", description: 'Cчета отправителя'})
    @IsString()
    @NotEqualFields('toAccount')
    fromAccount: string;

    @ApiProperty({example: "vbank", description: 'Идентификатор банка отправителя'})
    @IsString()
    fromBank: string;

    @ApiProperty({example: "4230156e885ea205641c", description: 'Cчет получателя'})
    @IsString()
    toAccount: string;

    @ApiProperty({example: "acc-1722", description: 'ID счета получателя'})
    @IsString()
    toAccountId: string;

    @ApiProperty({example: "abank", description: 'Идентификатор банка получателя'})
    @IsString()
    toBank: string;

    @ApiProperty({example: "Оплата за услуги", description: 'Комментарий к переводу'})
    @IsString()
    @IsOptional()
    comment?: string;
}

export class DepositDTO {
    @ApiProperty({example: "acc-1721", description: 'ID счета отправителя'})
    @IsString()
    fromAccountId: string;

    @ApiProperty({example: "40817810099910004312", description: 'Cчета отправителя'})
    @IsString()
    fromAccount: string;

    @ApiProperty({example: "vbank", description: 'Идентификатор банка отправителя'})
    @IsString()
    fromBank: string;

    @ApiProperty({example: 2500, description: 'Сумма для депозита'})
    @IsNumber()
    @Min(1)
    @Max(10000000)
    amount: number;
}