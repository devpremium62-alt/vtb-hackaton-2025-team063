import {CashbackType, OneCategoryCashbackType} from "@/entities/cashback";
import {banks} from "@/entities/bank";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {Card} from "@/shared/ui/icons/Card";

type Props = {
    cashback: OneCategoryCashbackType;
}

export const CategoryCashbackCard = ({cashback}: Props) => {
    return <div>
        <div className="flex items-center justify-between mb-0.5">
            <p className="text-sm font-medium">{banks[cashback.bank].name}</p>
            <p className="text-sm font-medium">{cashback.card.slice(-4)}</p>
        </div>
        <div className="flex items-center gap-1 text-white">
            <div className="bg-primary rounded-xl py-1 px-1.5 flex-1 flex items-center justify-between">
                <p className="text-xl font-semibold">
                    <MoneyAmount value={cashback.cashback.cashback}/>
                </p>
                <Card/>
            </div>
            <div className="bg-accent rounded-xl px-1.5 py-1">
                <p className="text-xl font-semibold">
                    {cashback.cashback.percents}%
                </p>
            </div>
        </div>
    </div>
}