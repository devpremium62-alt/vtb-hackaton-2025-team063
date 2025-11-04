"use client";

import 'dayjs/locale/ru';
import {Calendar} from "@mantine/dates";
import dayjs from "dayjs";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {PaymentType} from "@/entities/payment";
import {Dispatch, SetStateAction} from "react";
import {motion} from 'framer-motion';
import {AnimatePresence} from "framer-motion";

type Props = {
    payments: Record<string, PaymentType>;
    currentDate: Date;
    setCurrentDate: Dispatch<SetStateAction<Date>>;
}

const PaymentsCalendar = ({payments, currentDate, setCurrentDate}: Props) => {
    function prevMonth() {
        setCurrentDate((d) => dayjs(d).subtract(1, 'month').toDate());
    }

    function nextMonth() {
        setCurrentDate((d) => dayjs(d).add(1, 'month').toDate());
    }

    const monthLabel = dayjs(currentDate).locale('ru').format('MMMM');
    const yearLabel = dayjs(currentDate).locale('ru').format('YYYY');

    const now = new Date();

    return <AnimatePresence mode="wait">
        <motion.div
            key={currentDate.getMonth()}
            initial={{opacity: 0, x: -30}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 30}}
            transition={{duration: 0.3, ease: "easeInOut"}}
        >
            <div className="h-full flex-1 bg-tertiary rounded-xl px-1.5 py-[0.5625rem]">
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
                            height: 'auto',
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
                    renderDay={(dateStr) => {
                        let base =
                            'flex items-center justify-center rounded-full w-5 h-5 pt-0.25 mx-auto text-[0.6rem] font-medium leading-none';

                        const date = new Date(dateStr).getDate();
                        if (date > 10) {
                            base += ` pr-0.5`;
                        }

                        const payment = payments[dateStr];
                        if (!payment) {
                            return <div className={base}>{date}</div>;
                        }

                        if (payment.payed) {
                            return <div className={`${base} bg-success text-white`}>{date}</div>;
                        }

                        if (new Date(dateStr) < now) {
                            return <div className={`${base} bg-error text-white`}>{date}</div>;
                        }

                        return <div className={`${base} bg-info text-white`}>{date}</div>;
                    }}
                />
            </div>
        </motion.div>
    </AnimatePresence>
}

export default PaymentsCalendar;