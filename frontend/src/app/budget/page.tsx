import Goals from "@/app/budget/Goals";
import {ExpenseCategoryType} from "@/entities/expense-category";
import {ExpensesCategoryColors, ExpensesCategoryIcons} from "@/entities/expense-category/model/types";
import Wallet from "@/app/budget/Wallet";
import UpcomingPayments from "@/app/budget/UpcomingPayments";
import ChildAccount from "@/app/budget/ChildAccount";
import ExpenseStats from "@/app/budget/ExpenseStats";
import ExpenseList from "@/app/budget/ExpenseList";

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
    return <div className="py-4">
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
                <UpcomingPayments payments={[
                    {
                        date: new Date(2025, 10, 3),
                        money: 5000,
                        name: "На квартиру",
                        payed: true
                    },
                    {
                        date: new Date(2025, 10, 2),
                        money: 4500,
                        name: "Детский счет",
                        payed: false
                    },
                    {
                        date: new Date(2025, 10, 10),
                        name: "Подписка",
                        money: 500,
                        payed: false
                    },
                    {
                        date: new Date(2025, 10, 20),
                        name: "Кредит",
                        money: 10000,
                        payed: false
                    },
                    {
                        date: new Date(2025, 11, 3),
                        money: 5000,
                        name: "На квартиру",
                        payed: false
                    }
                ]}/>
            </div>
            <div>
                <ChildAccount moneyCollected={50000} moneyPerDay={2500} avatar="/images/woman.png"/>
                <ExpenseStats expenseCategories={categories}/>
                <ExpenseList expenses={[
                    {
                        id: "1",
                        category: categories[5],
                        date: new Date(2025, 8, 29),
                        name: "Золотое яблоко",
                        outcome: true,
                        value: 20000,
                        bank:"Альфабанк"
                    },
                    {
                        id: "2",
                        category: categories[4],
                        date: new Date(2025, 8, 28),
                        name: "ИП МАРИЯ МОРОЗОВА",
                        outcome: false,
                        value: 20000,
                        bank:"Сбербанк"
                    },
                    {
                        id: "3",
                        category: categories[3],
                        date: new Date(2025, 8, 22),
                        name: "Стрелка",
                        outcome: true,
                        value: 1000,
                        bank:"Альфабанк"
                    },
                    {
                        id: "4",
                        category: categories[5],
                        date: new Date(2024, 8, 29),
                        name: "Золотое яблоко",
                        outcome: true,
                        value: 20000,
                        bank:"Альфабанк"
                    },
                    {
                        id: "5",
                        category: categories[4],
                        date: new Date(2024, 8, 28),
                        name: "ИП МАРИЯ МОРОЗОВА",
                        outcome: false,
                        value: 20000,
                        bank:"Сбербанк"
                    },
                    {
                        id: "6",
                        category: categories[3],
                        date: new Date(2024, 8, 22),
                        name: "Стрелка",
                        outcome: true,
                        value: 1000,
                        bank:"Альфабанк"
                    }
                ]}/>
            </div>
        </div>
    </div>
}