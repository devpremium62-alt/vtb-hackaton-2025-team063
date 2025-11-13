export type TransactionType = {
    id: string;
    category: {
        id: number;
        name: string;
    };
    name: string;
    value: number;
    outcome: boolean;
    bank: string;
    date: Date;
}

export type DepositType = {
    fromAccountId: string;
    fromAccount: string;
    fromBank: string;
    amount: number;
}

export function toExcelData(expenses: TransactionType[]) {
    return expenses.map(item => ({
        "Название": item.name,
        "Дата операции": new Date(item.date).toLocaleDateString("ru-RU"),
        "Категория": item.category.name,
        "Тип": item.outcome ? "Исходящее" : "Входящее",
        "Сумма (₽)": item.value,
        "Банк": item.bank
    }));
}