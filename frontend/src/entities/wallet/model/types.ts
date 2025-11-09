import {ExpenseCategoryType} from "@/entities/expense-category";
import {BankKey} from "@/entities/bank";

export type WalletType = {
    name: string;
    id: number;
    category: ExpenseCategoryType;
    money: number;
    limit: number;
    bank: BankKey;
    period: "month" | "week";
    isDirty?: boolean;
}