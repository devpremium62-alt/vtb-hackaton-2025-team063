"use client";

import Heading from "@/shared/ui/typography/Heading";
import {
    getPayments,
    isPaymentActual,
    isPaymentExpired,
    isPaymentPayed,
    PaymentLarge,
} from "@/entities/payment";
import React, {ChangeEvent, useMemo, useState} from "react";
import {PaymentsCalendar} from "@/widgets/payments-calendar";
import AccentButton from "@/shared/ui/AccentButton";
import {Plus} from "@/shared/ui/icons/Plus";
import SearchInput from "@/shared/ui/inputs/SearchInput";
import Select from "@/shared/ui/inputs/Select";
import {Filter} from "@/shared/ui/icons/Filter";
import NearestPayment from "@/app/(main)/budget/NearestPayment";
import {PaymentsList} from "@/widgets/payments-list";
import {CreatePayment} from "@/widgets/create-payment";
import {DepositPayment} from "@/widgets/deposit-payment";
import {useQuery} from "@tanstack/react-query";

const UpcomingPayments = () => {
    const [isDepositModalOpen, setDepositModalOpen] = useState(false);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedName, setSelectedName] = useState("all");
    const [currentPaymentId, setCurrentPaymentId] = useState<number | null>(null);

    const {data: payments = []} = useQuery({
        queryKey: ["payments"],
        queryFn: getPayments,
        refetchInterval: 5000
    });

    const uniquePaymentNames = useMemo(() => {
        return Array.from(new Set(payments.map(p => p.name)));
    }, [payments]);

    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            let searchSubstr = search.toLowerCase().trim();
            if (search && !p.name.toLowerCase().includes(searchSubstr)) {
                return false;
            }

            if (selectedStatus === "waiting" && !isPaymentActual(p)
                || selectedStatus === "expired" && !isPaymentExpired(p)
                || selectedStatus === "payed" && !isPaymentPayed(p)) {
                return false;
            }

            if (selectedName !== "all" && p.name !== selectedName) {
                return false;
            }

            return true;
        });
    }, [payments, search, selectedStatus, selectedName]);

    const dateToPayment = useMemo(() => {
        return Object.fromEntries(filteredPayments.map(p => [p.date.toISOString().slice(0, 10), {...p}]));
    }, [filteredPayments]);

    const nearestPayment = useMemo(() => {
        return payments.find(p => p.date > new Date());
    }, [payments]);

    function onDepositClick(id: number) {
        setCurrentPaymentId(id);
        setDepositModalOpen(true);
    }

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="mb-2.5">
            <Heading level={2}>Календарь платежей</Heading>
        </div>
        <div className="mb-1 flex items-stretch gap-1">
            <SearchInput value={search} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                         className="flex-1" placeholder="Поиск платежей"/>
            <AccentButton onClick={() => setCreateModalOpen(true)}>
                <Plus className="mr-1"/>
                Создать платеж
            </AccentButton>
        </div>
        <div className="mb-2.5 flex items-stretch gap-1">
            <Select onChange={setSelectedStatus} className="flex-1" options={[
                {label: "Все статусы", value: "all"}, {label: "Ожидается", value: "waiting"},
                {label: "Просрочен", value: "expired"}, {label: "Оплачен", value: "payed"}
            ]}/>
            <Select onChange={setSelectedName} className="flex-1" options={[{label: "Все платежи", value: "all"},
                ...uniquePaymentNames.map(p => ({value: p, label: p}))]}/>
            <button className="bg-tertiary cursor-pointer w-7 h-7 rounded-xl flex justify-center items-center">
                <Filter/>
            </button>
        </div>
        {nearestPayment && <NearestPayment onDepositClick={onDepositClick} payment={nearestPayment}/>}
        <div className="mb-2.5">
            <PaymentsCalendar large currentDate={currentDate} setCurrentDate={setCurrentDate} payments={dateToPayment}/>
        </div>
        <div>
            <Heading level={3}>Все платежи</Heading>
            <PaymentsList limit={filteredPayments.length} currentDate={currentDate} payments={filteredPayments}
                          onDepositClick={onDepositClick}
                          paymentMarkup={(payment, onDepositClick) => <PaymentLarge onDepositClick={onDepositClick}
                                                                                    payment={payment}/>}
                          skeletonMarkup={(i) => (
                              <div key={i} className="h-16 rounded-xl bg-tertiary animate-pulse"/>
                          )}/>
        </div>
        <CreatePayment isActive={isCreateModalOpen} setActive={setCreateModalOpen}/>
        <DepositPayment currentPaymentId={currentPaymentId} isActive={isDepositModalOpen} setActive={setDepositModalOpen}/>
    </section>
}

export default UpcomingPayments;