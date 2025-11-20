import {CashbackType} from "@/entities/cashback";

export function getUserCashback(userId: number, cashback: CashbackType[]) {
    return getTotalCashback(cashback.filter(c => c.user === userId));
}

export function getTotalCashback(cashback: CashbackType[]) {
    return cashback.reduce((acc, card) =>
            acc + card.cashback.reduce((accCard, cashback) => accCard + cashback.cashback, 0),
        0);
}