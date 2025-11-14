"use client";

import Heading from "@/shared/ui/typography/Heading";
import React, {useMemo, useState} from "react";
import {BankKey, banks, ConnectableBank, getConsents} from "@/entities/bank";
import {useQuery} from "@tanstack/react-query";
import {CreateBankConsent} from "@/features/create-bank-consent";
import {BanksConnection} from "@/features/banks-connection/ui/BanksConnection";

type Props = {
    className?: string;
}

const BanksConnect = ({className}: Props) => {
    return <section className={`${className} mb-[1.875rem]`}>
        <div className="mb-2.5 flex items-center justify-between flex-wrap">
            <Heading level={2}>Доступные банки</Heading>
        </div>
        <BanksConnection bankMarkup={(bankId, consent, onClick) => {
            return <ConnectableBank key={bankId} bankId={bankId as BankKey} onClick={onClick}
                                    consent={consent}/>
        }}/>
    </section>
}

export default BanksConnect;