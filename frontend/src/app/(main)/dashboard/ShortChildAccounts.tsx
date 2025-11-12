"use client";

import Heading from "@/shared/ui/typography/Heading";
import {useState} from "react";
import {DepositChildAccount} from "@/features/deposit-child-account";
import {useQuery} from "@tanstack/react-query";
import {
    ChildAccountSimple, ChildAccountType,
    getChildAccounts
} from "@/entities/child-account";
import {ChildAccountsCarousel} from "@/widgets/chil-accounts-carousel";

export const ShortChildAccounts = () => {
    const [isModalActive, setModalActive] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<ChildAccountType | null>(null);

    const {data: childAccounts = []} = useQuery({
        queryKey: ["child-accounts"],
        queryFn: getChildAccounts,
        refetchInterval: 5000
    });

    function onDepositClick(account: ChildAccountType) {
        setSelectedAccount(account);
        setModalActive(true);
    }

    return <section className="mx-4 md:ml-0 mb-24">
        <Heading level={2}>Детские счета</Heading>
        <ChildAccountsCarousel childAccounts={childAccounts}
                               component={(account) => <ChildAccountSimple account={account}
                                                                           onDepositClick={onDepositClick}/>}/>
        <DepositChildAccount isActive={isModalActive} setActive={setModalActive} activeAccount={selectedAccount}/>
    </section>
}
