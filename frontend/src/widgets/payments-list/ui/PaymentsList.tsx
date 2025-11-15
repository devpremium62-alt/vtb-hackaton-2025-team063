import {AnimatePresence, motion} from "framer-motion";
import {PaymentType} from "@/entities/payment";
import React, {JSX, useMemo} from "react";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";

type Props = {
    onDepositClick: (payment: PaymentType) => void;
    currentDate: Date;
    limit?: number;
    payments: PaymentType[];
    paymentMarkup: (payment: PaymentType, onDepositClick: (payment: PaymentType) => void) => JSX.Element;
    skeletonMarkup: (key: number) => JSX.Element;
}

function isSameMonth(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

export const PaymentsList = ({currentDate, payments, paymentMarkup, skeletonMarkup, onDepositClick, limit = 4}: Props) => {
    const isLoading = useShowingSkeleton(currentDate);

    const sortedPayments = useMemo(() => {
        return payments.filter(p => isSameMonth(new Date(p.date), currentDate)).sort((p1, p2) => new Date(p1.date).getTime() - new Date(p2.date).getTime());
    }, [payments, currentDate]);

    const hasPayments = sortedPayments.length > 0;

    return <AnimatePresence mode="popLayout">
        <div className="col-span-6 lg:col-span-5 flex items-center justify-center">
            {isLoading ? (
                <div className="flex-1 flex flex-col gap-1">
                    {Array.from({length: limit}).map((_, i) => skeletonMarkup(i))}
                </div>
            ) : hasPayments ? (
                <motion.div
                    key={currentDate.getMonth()}
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.25, ease: "easeOut"}}
                    className="flex-1 flex flex-col gap-1"
                >
                    {sortedPayments.slice(0, limit).map(payment => (
                        <motion.div
                            key={payment.id}
                            initial={{opacity: 0, x: -5}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: 5}}
                            transition={{duration: 0.2}}
                            layout
                        >
                            {paymentMarkup(payment, onDepositClick)}
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div
                    key="no-payments"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.2}}
                    className="flex-1 flex items-center justify-center"
                >
                    <p className="text-center text-secondary text-sm font-medium">
                        В этом месяце нет запланированных платежей
                    </p>
                </motion.div>
            )}
        </div>
    </AnimatePresence>;
}