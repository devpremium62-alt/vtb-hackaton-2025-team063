import {PaymentType} from "@/entities/payment";
import MoneyAmount from "@/shared/ui/MoneyAmount";

type Props = {
    payment: PaymentType;
}

export const Payment = ({payment}: Props) => {
    return <article
        className={`${!payment.payed && payment.date < new Date() ? "bg-error-transparent" : "bg-tertiary"} px-1.5 py-1 rounded-xl`}>
        <div className="flex items-center gap-1 justify-between mb-0.5">
            <p className="text-xs font-medium text-ellipsis min-w-0 overflow-hidden whitespace-nowrap">{payment.name}</p>
            <p className="shrink-0 text-sm font-medium">
                <MoneyAmount value={payment.money}/>
            </p>
        </div>
        <div className="flex items-center gap-1 justify-between">
            <time className="text-secondary text-[0.6rem] leading-none">{payment.date.toLocaleDateString()}</time>
            <Status payment={payment}/>
        </div>
    </article>;
}

const Status = ({payment}: Props) => {
    const baseClasses = "text-[0.6rem] font-medium";

    if (payment.payed) {
        return <p className={`${baseClasses} text-success`}>Внесено</p>
    }

    if (payment.date < new Date()) {
        return <p className={`${baseClasses} text-error`}>Просрочен</p>
    }

    return <p className={`${baseClasses} flex items-center gap-1.5`}>
        <span className="text-info">Ожидается</span>
        <button className="cursor-pointer">Внести</button>
    </p>
}