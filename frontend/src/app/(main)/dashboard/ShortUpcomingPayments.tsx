"use client";

import Heading from "@/shared/ui/typography/Heading";
import {Payment, PaymentType} from "@/entities/payment";
import React, {useMemo, useState} from "react";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";
import {PaymentsCalendar} from "@/widgets/payments-calendar";
import {PaymentsList} from "@/widgets/payments-list";

type Props = {
    payments: PaymentType[];
}

function isSameMonth(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

const ShortUpcomingPayments = ({payments}: Props) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const isLoading = useShowingSkeleton(currentDate);

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
            <PaymentsList currentDate={currentDate} payments={payments}
                paymentMarkup={(payment) => <Payment payment={payment}/>}
                skeletonMarkup={(i) => (
                    <div key={i} className="h-11 rounded-xl bg-tertiary animate-pulse"/>
                )}/>
        </div>
    </section>
}

export default ShortUpcomingPayments;