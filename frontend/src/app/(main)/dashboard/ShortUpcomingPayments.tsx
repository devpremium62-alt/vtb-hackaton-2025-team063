"use client";

import Heading from "@/shared/ui/typography/Heading";
import {getPayments, Payment, PaymentType} from "@/entities/payment";
import React, {useMemo, useState} from "react";
import {PaymentsCalendar} from "@/widgets/payments-calendar";
import {PaymentsList} from "@/widgets/payments-list";
import {DepositPayment} from "@/features/deposit-payment";
import {useQuery} from "@tanstack/react-query";

const ShortUpcomingPayments = () => {
    const [isModalActive, setModalActive] = useState(false);
    const [currentPayment, setCurrentPayment] = useState<PaymentType | null>(null);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const {data: payments = []} = useQuery({
        queryKey: ["payments"],
        queryFn: getPayments,
        refetchInterval: 5000
    });

    const dateToPayment = useMemo(() => {
        return Object.fromEntries(payments.map(p => [p.date.toISOString().slice(0, 10), {...p}]));
    }, [payments]);

    function onDepositClick(payment: PaymentType) {
        setCurrentPayment(payment);
        setModalActive(true);
    }

    return <section className="mx-4 md:mr-0 mb-5">
        <Heading level={2}>Ближайшие платежи</Heading>
        <div className="grid grid-cols-2 gap-2.5">
            <PaymentsCalendar currentDate={currentDate} setCurrentDate={setCurrentDate} payments={dateToPayment}/>
            <PaymentsList onDepositClick={onDepositClick} currentDate={currentDate} payments={payments}
                          paymentMarkup={(payment, onDepositClick) => <Payment onDepositClick={onDepositClick}
                                                                               payment={payment}/>}
                          skeletonMarkup={(i) => (
                              <div key={i} className="h-11 rounded-xl bg-tertiary animate-pulse"/>
                          )}/>
        </div>
        <DepositPayment currentPayment={currentPayment} isActive={isModalActive} setActive={setModalActive}/>
    </section>
}

export default ShortUpcomingPayments;