"use client";

import Heading from "@/shared/ui/typography/Heading";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import BalanceCounter from "@/shared/ui/MoneyCounting";
import CoupleAvatars from "@/shared/ui/CoupleAvatars";
import "dayjs/locale/ru";
import {useQuery} from "@tanstack/react-query";
import {getPersonalAccounts, getSharedAccounts} from "@/entities/account";

const SharedBalance = () => {
    const {data: sharedAccounts = null} = useQuery({
        queryKey: ["shared-accounts"],
        queryFn: getSharedAccounts,
    });

    const {data: personalAccounts = null} = useQuery({
        queryKey: ["personal-accounts"],
        queryFn: getPersonalAccounts,
    });

    const persons = Object.values(personalAccounts || {});

    if (!persons[0] || !persons[1]) {
        return null;
    }

    return <section className="p-2 rounded-xl bg-shared-balance mb-5 text-white mx-4">
        <div className="mb-12 flex items-center justify-between">
            <CoupleAvatars firstAvatar={persons[0].avatar} secondAvatar={persons[1].avatar}/>
            <div className="bg-primary px-3 py-1.5 rounded-2xl shadow-xl z-1">
                <p className="text-base font-semibold leading-tight">
                    + <MoneyAmount value={sharedAccounts?.monthlyIncome || 0}/>
                </p>
            </div>
        </div>

        <div className="flex items-end justify-between">
            <div>
                <p className="text-xs font-light mb-0.5 leading-tight">Общий баланс</p>
                <Heading level={1} className="flex items-center gap-1 tracking-[-0.06rem] leading-none mb-0 text-3xl xxs:text-4xl font-bold text-white">
                    <BalanceCounter value={sharedAccounts?.balance || 0}/>
                </Heading>
            </div>
            <div>
                <p className="text-base font-semibold leading-tight flex items-center gap-0.5">
                    <span>{persons[0].accountDigits}</span>
                    <span>•</span>
                    <span>{persons[1].accountDigits}</span>
                </p>
            </div>
        </div>
    </section>
}

export default SharedBalance;