import {ExpenseCategoryType} from "@/entities/expense-category";

export type ExpenseType = {
    id: string;
    category: ExpenseCategoryType;
    name: string;
    value: number;
    outcome: boolean;
    bank: string;
    date: Date;
}

export function toExcelData(expenses: ExpenseType[]) {
    return expenses.map(item => ({
        "Название": item.name,
        "Дата операции": new Date(item.date).toLocaleDateString("ru-RU"),
        "Категория": item.category.name,
        "Тип": item.outcome ? "Исходящее" : "Входящее",
        "Сумма (₽)": item.value,
        "Банк": item.bank
    }));
}