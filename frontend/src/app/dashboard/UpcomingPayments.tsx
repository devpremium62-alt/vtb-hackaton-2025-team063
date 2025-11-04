"use client";

import Heading from "@/shared/ui/typography/Heading";
import PaymentsCalendar from "@/app/dashboard/PaymentsCalendar";
import {Payment, PaymentType} from "@/entities/payment";
import React, {useEffect, useMemo, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

type Props = {
    payments: PaymentType[];
}

function isSameMonth(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

const UpcomingPayments = ({payments}: Props) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 0);
        return () => clearTimeout(t);
    }, [currentDate]);

    const dateToPayment = useMemo(() => {
        return Object.fromEntries(payments.map(p => [p.date.toISOString().slice(0, 10), {...p}]));
    }, [payments]);


    const sortedPayments = useMemo(() => {
        return payments.filter(p => isSameMonth(p.date, currentDate)).sort((p1, p2) => p1.date.getTime() - p2.date.getTime());
    }, [payments, currentDate]);

    const hasPayments = sortedPayments.length > 0;

    return <section className="mx-4 md:mr-0 mb-5">
        <Heading level={2}>Ближайшие платежи</Heading>
        <div className="grid grid-cols-2 gap-2.5">
            <PaymentsCalendar currentDate={currentDate} setCurrentDate={setCurrentDate} payments={dateToPayment}/>
            <AnimatePresence mode="popLayout">
                {isLoading ? (
                    <div className="flex-1 flex flex-col gap-1">
                        {Array.from({length: 4}).map((_, i) => (
                            <div key={i} className="h-11 rounded-xl bg-tertiary animate-pulse"/>
                        ))}
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
                        {sortedPayments.slice(0, 4).map(payment => (
                            <motion.div
                                key={payment.date.toISOString() + payment.name}
                                initial={{opacity: 0, x: -5}}
                                animate={{opacity: 1, x: 0}}
                                exit={{opacity: 0, x: 5}}
                                transition={{duration: 0.2}}
                            >
                                <Payment payment={payment}/>
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
            </AnimatePresence>
        </div>
    </section>
}

export default UpcomingPayments;