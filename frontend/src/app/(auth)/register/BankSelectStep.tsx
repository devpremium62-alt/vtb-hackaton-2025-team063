"use client";

import React, {useState} from "react";
import {motion} from "framer-motion";
import {Bank, BankKey, banks, ConnectableBank, ConnectableBankOnRegister, getConsents} from "@/entities/bank";
import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import AuthHead from "@/app/(auth)/AuthHead";
import {BanksConnection} from "@/features/banks-connection/ui/BanksConnection";
import {useQuery} from "@tanstack/react-query";

type Props = {
    onSuccess: (banks: BankKey[]) => void;
}

const BankSelectStep = ({onSuccess}: Props) => {
    const {data: consents = []} = useQuery({
        queryKey: ["consents"],
        queryFn: getConsents,
        refetchInterval: 5000,
    });

    return <>
        <AuthHead>
            <h1 className="text-3xl font-semibold leading-none mb-1.5">Выберите банк</h1>
            <p className="max-w-72 font-normal text-secondary leading-tight">Можно добавить до 4-х банков</p>
        </AuthHead>
        <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            transition={{duration: 0.3}}>
            <p className="text-right text-xs mb-0.5">{consents.length} / 4</p>

            <BanksConnection className="gap-2.5 mb-10" bankMarkup={(bankId, consent, onClick) => {
                return <ConnectableBankOnRegister key={bankId} bankId={bankId} selectBank={onClick} consent={consent} />;
            }}/>

            <div className="flex items-center justify-center px-4">
                <AccentButton large background="bg-primary"
                              onClick={() => onSuccess(consents.map(c => c.bankId as BankKey))}
                              className="justify-center py-2.5! font-normal! w-full">Продолжить</AccentButton>
            </div>
        </motion.div>
    </>
}

export default BankSelectStep;