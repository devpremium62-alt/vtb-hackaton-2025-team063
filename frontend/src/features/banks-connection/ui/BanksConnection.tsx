import React, {JSX, useMemo, useState} from "react";
import {BankKey, banks, Consent, getConsents} from "@/entities/bank";
import {useQuery} from "@tanstack/react-query";
import {CreateBankConsent} from "@/features/create-bank-consent";

type Props = {
    bankMarkup: (bankId: BankKey, consent: Consent | undefined, onClick: (bankId: BankKey) => void) => JSX.Element;
    className?: string;
}

export const BanksConnection = ({bankMarkup, className = "gap-1"}: Props) => {
    const [isModalActive, setModalActive] = useState(false);
    const [activeBank, setActiveBank] = useState<{ bankId: BankKey; clientId: string | null } | null>(null);

    const {data: consents = []} = useQuery({
        queryKey: ["consents"],
        queryFn: getConsents,
        refetchInterval: 5000,
    });

    const bankToConsent = useMemo(() => {
        return Object.fromEntries(consents.map((c) => [c.bankId, c]));
    }, [consents]);

    function onBankSelect(bankId: BankKey) {
        setActiveBank({bankId, clientId: bankToConsent[bankId] ? bankToConsent[bankId].clientId : null});
        setModalActive(true);
    }

    return <>
        <div className={`flex flex-col ${className}`}>
            {Object.entries(banks).map(([bankId, bank]) => (
                bankMarkup(bankId as BankKey, bankToConsent[bankId], onBankSelect)
            ))}
        </div>
        <CreateBankConsent isActive={isModalActive} setActive={setModalActive} bankId={activeBank?.bankId}
                           clientId={activeBank?.clientId}/>
    </>;
}