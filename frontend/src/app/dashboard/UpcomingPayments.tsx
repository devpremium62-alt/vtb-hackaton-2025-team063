"use client";

import Heading from "@/shared/ui/typography/Heading";
import PaymentsCalendar from "@/app/dashboard/PaymentsCalendar";
import {Payment, PaymentType} from "@/entities/payment";
import {useMemo, useState} from "react";

type Props = {
    payments: PaymentType[];
}

function isSameMonth(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

const UpcomingPayments = ({payments}: Props) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const dateToPayment = useMemo(() => {
        return Object.fromEntries(payments.map(p => [p.date.toISOString().slice(0, 10), {...p}]));
    }, [payments]);


    const sortedPayments = useMemo(() => {
        return payments.filter(p => isSameMonth(p.date, currentDate)).sort((p1, p2) => p1.date.getTime() - p2.date.getTime());
    }, [payments, currentDate]);

    return <section className="mx-4 md:mr-0 mb-5">
        <Heading level={2}>Ближайшие платежи</Heading>
        <div className="grid grid-cols-2 gap-2.5">
            <PaymentsCalendar currentDate={currentDate} setCurrentDate={setCurrentDate} payments={dateToPayment}/>
            {sortedPayments.length
                ? <div className="flex-1 flex flex-col gap-1">
                    {sortedPayments.slice(0, 4).map((payment) => (<Payment key={payment.date.toISOString() + payment.name} payment={payment}/>))}
                </div>
                : <div className="flex-1 flex items-center justify-center">
                    <p className="text-center text-secondary text-sm font-medium">В этом месяце нет запланированных платежей</p>
                </div>}


        </div>
    </section>
}

export default UpcomingPayments;