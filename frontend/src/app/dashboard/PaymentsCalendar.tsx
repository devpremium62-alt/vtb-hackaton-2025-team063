"use client";

import 'dayjs/locale/ru';
import {Calendar} from "@mantine/dates";
import dayjs from "dayjs";
import React, {useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {PaymentType} from "@/entities/payment";

type Props = {
    payments: Record<string, PaymentType>
}

const PaymentsCalendar = ({payments}: Props) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    function prevMonth() {
        setCurrentDate((d) => dayjs(d).subtract(1, 'month').toDate());
    }

    function nextMonth() {
        setCurrentDate((d) => dayjs(d).add(1, 'month').toDate());
    }

    const monthLabel = dayjs(currentDate).locale('ru').format('MMMM');
    const yearLabel = dayjs(currentDate).locale('ru').format('YYYY');

    const now = new Date();

    return <div className="flex-1 bg-tertiary rounded-xl px-1.5 py-2">
        <div className="flex items-center justify-between px-1.5 mb-3">
            <div className="flex items-center gap-1">
                <button className="cursor-pointer" onClick={prevMonth}>
                    <ChevronLeft className="w-3.5 h-3.5"/>
                </button>
                <p className="text-sm font-medium -mt-0.5">{monthLabel[0].toUpperCase() + monthLabel.slice(1)}</p>
                <button className="cursor-pointer" onClick={nextMonth}>
                    <ChevronRight className="w-3.5 h-3.5"/>
                </button>
            </div>
            <div>
                <p className="text-secondary text-sm font-medium">{yearLabel}</p>
            </div>
        </div>
        <Calendar
            date={currentDate}
            onDateChange={(d) => {
                setCurrentDate(new Date(d));
            }}
            locale="ru"
            styles={{
                calendarHeader: {
                    display: "none",
                },
                day: {
                    fontSize: '0.6rem',
                    color: "var(--text-primary)",
                    fontWeight: 500,
                    width: '100%',
                    height: 'auto'
                },
                weekday: {
                    fontSize: '0.6rem',
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    padding: 0
                },
                month: {
                    width: '100%',
                    fontSize: '16px',
                    fontWeight: 600,
                },
            }}
            renderDay={(date) => {
                const base =
                    'flex items-center justify-center rounded-full w-5 h-5 pr-0.25 pt-0.25 mx-auto text-[0.6rem] font-medium leading-none';
                const payment = payments[date];
                if(!payment) {
                    return <div className={base}>{new Date(date).getDate()}</div>;
                }

                if(payment.payed) {
                    return <div className={`${base} bg-success text-white`}>{new Date(date).getDate()}</div>;
                }

                if(new Date(date) < now) {
                    return <div className={`${base} bg-error text-white`}>{new Date(date).getDate()}</div>;
                }

                return <div className={`${base} bg-info text-white`}>{new Date(date).getDate()}</div>;
            }}
        />
    </div>
}

export default PaymentsCalendar;