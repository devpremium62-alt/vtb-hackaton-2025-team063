import {IsString, MaxLength} from 'class-validator';
import {ApiProperty, IntersectionType} from "@nestjs/swagger";
import {DepositDTO} from "../transactions/transaction.dto";

class PureWalletDTO {
    @ApiProperty({example: 'Продукты', description: 'Название кошелька'})
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({example: 1, description: 'Категория расходов'})
    categoryId: number;

    @ApiProperty({example: "abank", description: 'Идентификатор банка'})
    @IsString()
    bankId: string;
}

export class WalletDTO extends IntersectionType(PureWalletDTO, DepositDTO) {}