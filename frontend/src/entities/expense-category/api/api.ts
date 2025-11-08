import fetchWrap from "@/shared/lib/fetchWrap";
import {ExpenseCategoryType} from "@/entities/expense-category";

export async function getExpenseCategories(): Promise<ExpenseCategoryType[]> {
    return fetchWrap("/api/expenses/categories");
}