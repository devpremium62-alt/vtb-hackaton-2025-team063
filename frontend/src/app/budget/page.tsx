import Goals from "@/app/budget/Goals";
import {ExpenseCategoryType} from "@/entities/expense-category";
import {ExpensesCategoryColors, ExpensesCategoryIcons} from "@/entities/expense-category/model/types";
import Wallet from "@/app/budget/Wallet";

const categories: ExpenseCategoryType[] = [
    {
        name: "Развлечения",
        spent: 5000,
        color: ExpensesCategoryColors["Развлечения"],
        icon: ExpensesCategoryIcons["Развлечения"]
    },
    {
        name: "Продукты",
        spent: 45000,
        color: ExpensesCategoryColors["Продукты"],
        icon: ExpensesCategoryIcons["Продукты"]
    },
    {
        name: "ЖКХ и связь",
        spent: 4000,
        color: ExpensesCategoryColors["ЖКХ и связь"],
        icon: ExpensesCategoryIcons["ЖКХ и связь"]
    },
    {
        name: "Транспорт",
        spent: 10000,
        color: ExpensesCategoryColors["Транспорт"],
        icon: ExpensesCategoryIcons["Транспорт"]
    },
    {
        name: "Одежда и обувь",
        spent: 12000,
        color: ExpensesCategoryColors["Одежда и обувь"],
        icon: ExpensesCategoryIcons["Одежда и обувь"]
    },
    {
        name: "Подарки",
        spent: 1000,
        color: ExpensesCategoryColors["Подарки"],
        icon: ExpensesCategoryIcons["Подарки"]
    }
];

export default async function Budget() {
    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <Goals goals={[
                    {
                        id: 1,
                        name: "Поездка на море",
                        deadline: new Date(2025, 8, 29),
                        moneyCollected: 200000,
                        moneyNeed: 230000
                    },
                    {
                        id: 2,
                        name: "Квартира у моря",
                        deadline: new Date(2026, 3, 14),
                        moneyCollected: 80000000,
                        moneyNeed: 450000000
                    },
                ]}/>
                <Wallet walletItems={[
                    {category: categories[0], limit: 20000},
                    {category: categories[1], limit: 40000},
                    {category: categories[2], limit: 5000},
                ]}/>
            </div>
            <div>

            </div>
        </div>
    </div>
}