import {deletePayment, isPaymentExpired, isPaymentPayed, PaymentType} from "@/entities/payment";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import SwipeForDelete from "@/shared/ui/SwipeForDelete";
import {useQueryClient} from "@tanstack/react-query";
import {motion} from "framer-motion";
import useDelete from "@/shared/hooks/useDelete";
import AccentButton from "@/shared/ui/AccentButton";

type Props = {
    payment: PaymentType;
    onDepositClick: (payment: PaymentType) => void;
}

export const PaymentLarge = ({payment, onDepositClick}: Props) => {
    const queryClient = useQueryClient();
    const onDelete = useDelete(payment.id, deletePayment, onSuccess, "Удаление платежа...");

    function onSuccess() {
        queryClient.invalidateQueries({queryKey: ["payments"]});
    }

    return <div className="relative overflow-hidden">
        <SwipeForDelete onDelete={onDelete}>
            <motion.article
                className={`${isPaymentExpired(payment) ? "bg-error-transparent" : "bg-tertiary md:bg-blue-100/75!"} flex items-center justify-between p-2.5 rounded-xl gap-2`}
                exit={{opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0}}
                transition={{duration: 0.3}}
                layout>
                <div className="flex flex-col min-w-0">
                    <time className="text-secondary text-xs font-medium">{payment.date.toLocaleDateString()}</time>
                    <p className="font-semibold min-w-0 text-xl md:text-base text-ellipsis overflow-hidden whitespace-nowrap">{payment.name}</p>
                </div>
                <div className="flex flex-col items-end">
                    <p className="shrink-0 text-xl font-semibold">
                        <MoneyAmount value={payment.value}/>
                    </p>
                    <Status onDepositClick={onDepositClick} payment={payment}/>
                </div>
            </motion.article>
        </SwipeForDelete>
    </div>;
}

const Status = ({payment, onDepositClick}: Props) => {
    const baseClasses = "text-[0.6rem] text-white py-0.5 px-4 rounded-xl font-medium";

    if (isPaymentPayed(payment)) {
        return <p className={`${baseClasses} bg-info`}>Внесено</p>
    }

    if (isPaymentExpired(payment)) {
        return <p className={`${baseClasses} bg-error`}>Просрочен</p>
    }

    return <p className={`text-[0.6rem] font-medium flex items-center gap-1.5`}>
        <span className="text-info">Ожидается</span>
        <AccentButton onClick={() => onDepositClick(payment)}
                      className="text-sm font-medium bg-accent cursor-pointer text-white rounded-2xl py-0.5! px-2.5!">
            Внести
        </AccentButton>
    </p>
}