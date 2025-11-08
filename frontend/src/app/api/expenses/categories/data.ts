import {ExpenseCategoryType, ExpensesCategoryColors, ExpensesCategoryIcons} from "@/entities/expense-category";
import {getExpenses} from "@/app/api/expenses/data";

let categories: ExpenseCategoryType[] = [
    {
        id: 1,
        name: "Развлечения",
        spent: 0,
        color: ExpensesCategoryColors["Развлечения"],
        icon: ExpensesCategoryIcons["Развлечения"]
    },
    {
        id: 2,
        name: "Продукты",
        spent: 0,
        color: ExpensesCategoryColors["Продукты"],
        icon: ExpensesCategoryIcons["Продукты"]
    },
    {
        id: 3,
        name: "ЖКХ и связь",
        spent: 0,
        color: ExpensesCategoryColors["ЖКХ и связь"],
        icon: ExpensesCategoryIcons["ЖКХ и связь"]
    },
    {
        id: 4,
        name: "Транспорт",
        spent: 0,
        color: ExpensesCategoryColors["Транспорт"],
        icon: ExpensesCategoryIcons["Транспорт"]
    },
    {
        id: 5,
        name: "Одежда и обувь",
        spent: 0,
        color: ExpensesCategoryColors["Одежда и обувь"],
        icon: ExpensesCategoryIcons["Одежда и обувь"]
    },
    {
        id: 6,
        name: "Подарки",
        spent: 0,
        color: ExpensesCategoryColors["Подарки"],
        icon: ExpensesCategoryIcons["Подарки"]
    },
    {
        id: 7,
        name: "Здоровье",
        spent: 0,
        color: ExpensesCategoryColors["Здоровье"],
        icon: ExpensesCategoryIcons["Здоровье"]
    },
    {
        id: 8,
        name: "Кафе и рестораны",
        spent: 0,
        color: ExpensesCategoryColors["Кафе и рестораны"],
        icon: ExpensesCategoryIcons["Кафе и рестораны"]
    },
    {
        id: 9,
        name: "Прочее",
        spent: 0,
        color: ExpensesCategoryColors["Прочее"],
        icon: ExpensesCategoryIcons["Прочее"]
    }
];

export function getExpenseCategories() {
    const expenses = getExpenses();
    const newCategories = [...categories].map(c => structuredClone(c));
    expenses.map(e => {
        newCategories.forEach(c => {
            if(c.id === e.category.id && e.outcome) {
                c.spent += e.value;
            }
        });
    });

    return newCategories;
}

export function getExpenseCategoriesWithoutPopulation() {
    return categories;
}