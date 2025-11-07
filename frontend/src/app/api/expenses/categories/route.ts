import { NextResponse } from "next/server";
import {ExpensesCategoryColors, ExpensesCategoryIcons} from "@/entities/expense-category";

export async function GET() {
    const mockData = [
        {
            id: 1,
            name: "Развлечения",
            spent: 5000,
            color: ExpensesCategoryColors["Развлечения"],
            icon: ExpensesCategoryIcons["Развлечения"]
        },
        {
            id: 2,
            name: "Продукты",
            spent: 45000,
            color: ExpensesCategoryColors["Продукты"],
            icon: ExpensesCategoryIcons["Продукты"]
        },
        {
            id: 3,
            name: "ЖКХ и связь",
            spent: 4000,
            color: ExpensesCategoryColors["ЖКХ и связь"],
            icon: ExpensesCategoryIcons["ЖКХ и связь"]
        },
        {
            id: 4,
            name: "Транспорт",
            spent: 10000,
            color: ExpensesCategoryColors["Транспорт"],
            icon: ExpensesCategoryIcons["Транспорт"]
        },
        {
            id: 5,
            name: "Одежда и обувь",
            spent: 12000,
            color: ExpensesCategoryColors["Одежда и обувь"],
            icon: ExpensesCategoryIcons["Одежда и обувь"]
        },
        {
            id: 6,
            name: "Подарки",
            spent: 1000,
            color: ExpensesCategoryColors["Подарки"],
            icon: ExpensesCategoryIcons["Подарки"]
        }
    ];

    return NextResponse.json(mockData);
}