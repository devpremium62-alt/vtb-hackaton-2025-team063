"use client";

import Heading from "@/shared/ui/typography/Heading";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {
    ChildAccountSimple, ChildAccountType, depositChildAccount,
    getChildAccounts
} from "@/entities/child-account";
import {ChildAccountsCarousel} from "@/widgets/chil-accounts-carousel";
import {DepositModal} from "@/widgets/deposit-modal/ui/DepositModal";

type Props = {
    className?: string;
}

export const ShortChildAccounts = ({className}: Props) => {
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

    return <section className={`${className} mb-5 md:p-3 md:pb-6`}>
        <Heading className="mb-1" level={2}>Детские счета</Heading>
        <ChildAccountsCarousel childAccounts={childAccounts}
                               component={(account) => <ChildAccountSimple account={account}
                                                                           onDepositClick={onDepositClick}/>}/>
        <DepositModal isActive={isModalActive} setActive={setModalActive}
                      activeAccountId={selectedAccount?.id} entityName="child-account"
                      mutationFn={depositChildAccount}/>
    </section>
}
