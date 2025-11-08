import {ExpenseCategoryType} from "@/entities/expense-category";

export type PaymentType = {
    id: number;
    name: string;
    payed: boolean;
    money: number;
    category: ExpenseCategoryType;
    date: Date;
}