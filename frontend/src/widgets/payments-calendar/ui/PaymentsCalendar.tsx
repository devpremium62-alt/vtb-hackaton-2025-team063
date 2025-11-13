"use client";

import {Calendar} from "@mantine/dates";
import {isPaymentActual, isPaymentExpired, isPaymentPayed, PaymentType} from "@/entities/payment";
import {Dispatch, SetStateAction, useState} from "react";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import {AnimatePresence, motion} from "framer-motion";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {ChevronLeft} from "@/shared/ui/icons/ChevronLeft";
import {ChevronRight} from "@/shared/ui/icons/ChevronRight";

type Props = {
    payments: Record<string, PaymentType>;
    currentDate: Date;
    setCurrentDate: Dispatch<SetStateAction<Date>>;
    large?: boolean;
}

export const PaymentsCalendar = ({payments, currentDate, setCurrentDate, large}: Props) => {
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);

    function prevMonth() {
        setCurrentDate((d) => dayjs(d).subtract(1, 'month').toDate());
    }

    function nextMonth() {
        setCurrentDate((d) => dayjs(d).add(1, 'month').toDate());
    }

    const monthLabel = dayjs(currentDate).locale('ru').format('MMMM');
    const yearLabel = dayjs(currentDate).locale('ru').format('YYYY');

    return <div className="h-full flex-1 bg-tertiary rounded-xl px-1.5 py-[0.5625rem]">
        <AnimatePresence mode="wait">
            <motion.div
                key={currentDate.getMonth()}
                initial={{opacity: 0, x: -30}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 30}}
                transition={{duration: 0.3, ease: "easeInOut"}}
            >
                <div className="flex items-center justify-between px-1.5 mb-3">
                    <div className="flex items-center gap-1">
                        <button className="cursor-pointer" onClick={prevMonth}>
                            <ChevronLeft className="w-3.5 h-3.5"/>
                        </button>
                        <p className={`${large ? "text-xl" : "text-sm"} font-medium -mt-0.5`}>{monthLabel[0].toUpperCase() + monthLabel.slice(1)}</p>
                        <button className="cursor-pointer" onClick={nextMonth}>
                            <ChevronRight className="w-3.5 h-3.5"/>
                        </button>
                    </div>
                    <div>
                        <p className={`text-light ${large ? "text-xl" : "text-sm"} font-medium`}>{yearLabel}</p>
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
                            fontSize: large ? "0.75rem" : "0.6rem",
                            color: "var(--text-primary)",
                            fontWeight: 500,
                            width: "100%",
                            margin: large ? "0.4rem 0" : 0,
                            height: "auto",
                        },
                        weekday: {
                            fontSize: large ? "0.75rem" : "0.6rem",
                            fontWeight: 500,
                            color: "var(--text-light)",
                            padding: 0
                        },
                        month: {
                            width: "100%",
                            fontSize: "1rem",
                            fontWeight: 600,
                        },
                    }}
                    renderDay={(dateStr) => {
                        const date = new Date(dateStr);
                        const day = date.getDate();
                        const payment = payments[dateStr];

                        let base =
                            `hover:bg-none relative flex items-center justify-center rounded-full mx-auto ${large ? "w-10 h-5 text-xs" : "w-5 h-5 text-[0.6rem] pt-0.25 "} font-medium leading-none`;

                        let colorClass = "bg-info text-white";
                        if (!payment) {
                            colorClass = "";
                        } else if (isPaymentActual(payment)) {
                            colorClass = "bg-success text-white";
                        } else if (isPaymentExpired(payment)) {
                            colorClass = "bg-error text-white";
                        }

                        return (
                            <div
                                key={dateStr}
                                className={`${base} ${colorClass}`}
                                onMouseEnter={() => setHoveredDate(dateStr)}
                                onMouseLeave={() => setHoveredDate(null)}
                            >
                                {day}

                                <AnimatePresence>
                                    {hoveredDate === dateStr && payment && (
                                        <motion.div
                                            initial={{opacity: 0, y: -6}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, y: -6}}
                                            transition={{duration: 0.15}}
                                            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 ${colorClass} text-white rounded-md shadow-md p-1.5 text-[0.625rem]`}>
                                            <MoneyAmount value={payment.value}/>
                                            <div
                                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-inherit rounded-xs"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }}
                />
            </motion.div>
        </AnimatePresence>
    </div>
}