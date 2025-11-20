"use client";

import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {ConfigureAutopay} from "@/features/configure-autopay";
import {useMemo, useState} from "react";
import {CashbackType, getFamilyCashback, getTotalCashback} from "@/entities/cashback";
import {useQuery} from "@tanstack/react-query";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";

type Props = {
    className?: string;
    cashbackInitial: CashbackType[];
}

const CashbackPromo = ({cashbackInitial, className = ""}: Props) => {
    const [isModalActive, setModalActive] = useState(false);

    const {data: cashback = []} = useQuery({
        queryKey: ["family-cashback"],
        initialData: cashbackInitial,
        queryFn: getFamilyCashback,
        refetchInterval: REFETCH_INTERVAL,
        staleTime: REFETCH_INTERVAL
    });

    const totalCashback = useMemo(() => {
        return getTotalCashback(cashback);
    }, [cashback]);

    return <section className={`${className} cashback-promo mb-2.5 px-2.5 py-2 rounded-xl`}>
        <Heading className="text-white" level={2}>Хотите на отдых? Легко!</Heading>
        <p className="text-xs text-[#A1B7DB] mb-2.5 max-w-5/6">Настройте автоплатеж перевода кэшбэка в “цели” и тогда вы точно сможете полететь на Мальдивы!</p>
        <AccentButton onClick={() => setModalActive(true)}>Настроить автоплатеж</AccentButton>
        <ConfigureAutopay isActive={isModalActive} setActive={setModalActive} maxValue={totalCashback}/>
    </section>
}

export default CashbackPromo;