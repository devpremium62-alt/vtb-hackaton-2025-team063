import {ExpenseCategoryType} from "@/entities/expense-category";

export type WalletType = {
    id: number;
    category: ExpenseCategoryType;
    spent: number;
    limit: number;
}