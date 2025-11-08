import fetchWrap from "@/shared/lib/fetchWrap";
import {ExpenseType} from "@/entities/expense";

export async function getExpenses(): Promise<ExpenseType[]> {
    const expenses = await fetchWrap("/api/expenses");
    return expenses.map((expense: ExpenseType) => ({
        ...expense,
        date: new Date(expense.date),
    }));
}

export async function updateExpenseCategory({expenseId, categoryId}: {expenseId: string, categoryId: number}): Promise<ExpenseType[]> {
    const expense = await fetchWrap("/api/expenses", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({expenseId, categoryId}),
    });

    expense.date = new Date(expense.date);
    return expense;
}