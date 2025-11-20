import {BankKey} from "@/entities/bank";

export type CashbackType = {
    user: number;
    bank: BankKey;
    card: string;
    cashback: CategoryCashbackType[];
}

export type OneCategoryCashbackType = {
    user: number;
    bank: BankKey;
    card: string;
    cashback: CategoryCashbackType;
}

export type CategoryCashbackType = {
    date: Date;
    percents: number;
    cashback: number;
    category: number;
}