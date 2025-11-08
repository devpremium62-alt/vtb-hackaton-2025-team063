import {ExpenseCategoryType} from "@/entities/expense-category";
import {BankKeys} from "@/entities/bank";

export type WalletType = {
    name: string;
    id: number;
    category: ExpenseCategoryType;
    money: number;
    limit: number;
    bank: BankKeys;
    period: "month" | "week";
    isDirty?: boolean;
}