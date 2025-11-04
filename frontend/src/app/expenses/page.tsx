import Limits from "@/app/expenses/Limits";
import SharedExpenses from "@/app/expenses/SharedExpenses";
import {
    ExpenseCategoryType,
    ExpenseseCategoryColors,
    ExpenseseCategoryIcons
} from "@/entities/expense-category/model/types";
import PersonalExpenses from "@/app/expenses/PersonalExpenses";

const categories: ExpenseCategoryType[] = [
    {
        name: "Развлечения",
        spent: 5000,
        color: ExpenseseCategoryColors["Развлечения"],
        icon: ExpenseseCategoryIcons["Развлечения"]
    },
    {
        name: "Продукты",
        spent: 45000,
        color: ExpenseseCategoryColors["Продукты"],
        icon: ExpenseseCategoryIcons["Продукты"]
    },
    {
        name: "ЖКХ и связь",
        spent: 4000,
        color: ExpenseseCategoryColors["ЖКХ и связь"],
        icon: ExpenseseCategoryIcons["ЖКХ и связь"]
    },
    {
        name: "Транспорт",
        spent: 10000,
        color: ExpenseseCategoryColors["Транспорт"],
        icon: ExpenseseCategoryIcons["Транспорт"]
    },
    {
        name: "Одежда и обувь",
        spent: 12000,
        color: ExpenseseCategoryColors["Одежда и обувь"],
        icon: ExpenseseCategoryIcons["Одежда и обувь"]
    },
    {
        name: "Подарки",
        spent: 1000,
        color: ExpenseseCategoryColors["Подарки"],
        icon: ExpenseseCategoryIcons["Подарки"]
    }
];

export default function Expenses() {
    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <Limits limits={[
                    {category: categories[0], limit: 20000},
                    {category: categories[1], limit: 40000},
                    {category: categories[2], limit: 5000},
                ]}/>
                <SharedExpenses firstAvatar="/images/man.png" secondAvatar="/images/woman.png"
                                expenseCategories={categories}/>
            </div>
            <div>
                <PersonalExpenses avatar="/images/woman.png" expenseCategories={categories}/>
            </div>
        </div>
    </div>
}