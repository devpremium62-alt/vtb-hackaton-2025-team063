import universalFetch from "@/shared/lib/universalFetch";
import {CashbackType} from "@/entities/cashback";

export async function getFamilyCashback() {
    const response = await universalFetch<CashbackType[]>("/family/cashback");
    return response.map(card => {
        return {
            ...card,
            cashback: card.cashback.map(cashback => {
                    return {
                        ...cashback,
                        date: new Date(cashback.date)
                    }
                }
            )
        }
    })
}