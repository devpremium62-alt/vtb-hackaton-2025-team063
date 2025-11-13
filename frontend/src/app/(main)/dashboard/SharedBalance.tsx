"use client";

import Heading from "@/shared/ui/typography/Heading";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import BalanceCounter from "@/shared/ui/MoneyCounting";
import CoupleAvatars from "@/shared/ui/CoupleAvatars";
import "dayjs/locale/ru";
import {useQuery} from "@tanstack/react-query";
import {getFamilyFinance} from "@/entities/family/api/api";
import getAbsoluteSeverUrl from "@/shared/lib/getAbsoluteServerUrl";
import {useMemo} from "react";

const SharedBalance = () => {
    const {data: familyFinance = []} = useQuery({
        queryKey: ["family-finance"],
        queryFn: getFamilyFinance,
        refetchInterval: 5000
    });

    const sharedBalance = useMemo(() => {
        return familyFinance.reduce((acc, f) => acc + f.balance, 0);
    }, [familyFinance]);

    const sharedIncome = useMemo(() => {
        return familyFinance.reduce((acc, f) => acc + f.monthlyIncome, 0);
    }, [familyFinance]);

    return <section className="p-2 rounded-xl bg-shared-balance mb-5 text-white mx-4">
        <div className="mb-12 flex items-center justify-between">
            <CoupleAvatars firstAvatar={getAbsoluteSeverUrl(familyFinance[0].avatar)}
                           secondAvatar={getAbsoluteSeverUrl(familyFinance[1].avatar)}/>
            <div className="bg-primary px-3 py-1.5 rounded-2xl shadow-xl z-1">
                <p className="text-base font-semibold leading-tight">
                    + <MoneyAmount value={sharedIncome}/>
                </p>
            </div>
        </div>

        <div className="flex items-end justify-between">
            <div>
                <p className="text-xs font-light mb-0.5 leading-tight">Общий баланс</p>
                <Heading level={1}
                         className="flex items-center gap-1 tracking-[-0.06rem] leading-none text-3xl xxs:text-4xl font-bold text-white">
                    <BalanceCounter value={sharedBalance}/>
                </Heading>
            </div>
            <div>
                <p className="text-base font-semibold leading-tight flex items-center gap-0.5">
                    <span>{familyFinance[0].account}</span>
                    {familyFinance[1].account
                        ? <>
                            <span>•</span>
                            <span>{familyFinance[1].account}</span>
                        </>
                        : <></>
                    }
                </p>
            </div>
        </div>
    </section>
}

export default SharedBalance;