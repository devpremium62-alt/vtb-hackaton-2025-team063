import {ExpenseCategoryType} from "@/entities/expense-category";

export type LimitType = {
    category: ExpenseCategoryType;
    limit: number;
}