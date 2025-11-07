import {isPaymentExpired, isPaymentPayed, PaymentType} from "@/entities/payment";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import SwipeForDelete from "@/shared/ui/SwipeForDelete";

type Props = {
    payment: PaymentType;
    onDepositClick: (id: number) => void;
}

export const Payment = ({payment, onDepositClick}: Props) => {
    return <div className="relative overflow-hidden">
        <SwipeForDelete onDelete={() => {}}>
            <article
                className={`${!payment.payed && payment.date < new Date() ? "bg-error-transparent" : "bg-tertiary"} px-1.5 py-1 rounded-xl`}>
                <div className="flex items-center gap-1 justify-between mb-0.5">
                    <p className="text-xs font-medium text-ellipsis min-w-0 overflow-hidden whitespace-nowrap">{payment.name}</p>
                    <p className="shrink-0 text-sm font-medium">
                        <MoneyAmount value={payment.money}/>
                    </p>
                </div>
                <div className="flex items-center gap-1 justify-between">
                    <time className="text-light text-[0.6rem] leading-none">{payment.date.toLocaleDateString()}</time>
                    <Status onDepositClick={onDepositClick} payment={payment}/>
                </div>
            </article>
        </SwipeForDelete>
    </div>;
}

const Status = ({payment, onDepositClick}: Props) => {
    const baseClasses = "text-[0.6rem] font-medium";

    if (isPaymentPayed(payment)) {
        return <p className={`${baseClasses} text-success`}>Внесено</p>
    }

    if (isPaymentExpired(payment)) {
        return <p className={`${baseClasses} text-error`}>Просрочен</p>
    }

    return <p className={`${baseClasses} flex items-center gap-1.5`}>
        <span className="text-info">Ожидается</span>
        <button className="cursor-pointer" onClick={() => onDepositClick(payment.id)}>Внести</button>
    </p>
}