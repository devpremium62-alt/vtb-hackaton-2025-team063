import {ExpenseCategoryType} from "@/entities/expense-category";

export type LimitType = {
    id: number;
    category: ExpenseCategoryType;
    limit: number;
}