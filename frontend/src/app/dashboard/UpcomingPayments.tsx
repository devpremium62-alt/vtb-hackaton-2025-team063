"use client";

import Heading from "@/shared/ui/typography/Heading";
import PaymentsCalendar from "@/app/dashboard/PaymentsCalendar";
import {PaymentType} from "@/entities/payment";
import {useMemo} from "react";

type Props = {
    payments: PaymentType[];
}

const UpcomingPayments = ({payments}: Props) => {
    const dateToPayment = useMemo(() => {
        return Object.fromEntries(payments.map(p => [p.date.toISOString().slice(0, 10), {...p}]));
    }, [payments]);

    return <section className="mx-4 md:mr-0 mb-5">
        <Heading level={2}>Ближайшие платежи</Heading>
        <div className="flex items-center gap-2.5">
            <PaymentsCalendar payments={dateToPayment}/>
            <div className="flex-1"></div>
        </div>
    </section>
}

export default UpcomingPayments;