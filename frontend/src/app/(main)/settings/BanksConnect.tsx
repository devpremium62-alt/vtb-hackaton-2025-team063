"use client";

import Heading from "@/shared/ui/typography/Heading";
import React, {useMemo, useState} from "react";
import {BankKey, banks, ConnectableBank, getConsents} from "@/entities/bank";
import {useQuery} from "@tanstack/react-query";
import {CreateBankConsent} from "@/features/create-bank-consent";

const BanksConnect = () => {
    const [isModalActive, setModalActive] = useState(false);
    const [activeBank, setActiveBank] = useState<{ bankId: BankKey; clientId: string | null } | null>(null);

    const {data: consents = []} = useQuery({
        queryKey: ["consents"],
        queryFn: getConsents,
    });

    const bankToConsent = useMemo(() => {
        return Object.fromEntries(consents.map((c) => [c.bankId, c.clientId]));
    }, [consents]);

    function onBankSelect(bankId: BankKey) {
        setActiveBank({bankId, clientId: bankToConsent[bankId]});
        setModalActive(true);
    }

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="mb-2.5 flex items-center justify-between flex-wrap">
            <Heading level={2}>Доступные банки</Heading>
        </div>
        <div className="flex flex-col gap-1">
            {Object.entries(banks).map(([bankId, bank]) => (
                <ConnectableBank key={bankId} bankId={bankId as BankKey} bank={bank} onClick={onBankSelect}
                                 isConnected={Boolean(bankToConsent[bankId])}/>))}
        </div>
        <CreateBankConsent isActive={isModalActive} setActive={setModalActive} bankId={activeBank?.bankId}
                           clientId={activeBank?.clientId}/>
    </section>
}

export default BanksConnect;