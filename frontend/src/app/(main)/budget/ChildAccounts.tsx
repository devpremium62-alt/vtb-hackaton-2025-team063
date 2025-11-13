"use client";

import Heading from "@/shared/ui/typography/Heading";
import {useState} from "react";
import {ChangeChildAccountLimit} from "@/features/change-child-account-limit";
import {useQuery} from "@tanstack/react-query";
import {
    ChildAccountExtended,
    ChildAccountType, depositChildAccount,
    getChildAccounts
} from "@/entities/child-account";
import {ChildAccountsCarousel} from "@/widgets/chil-accounts-carousel";
import {DepositModal} from "@/widgets/deposit-modal/ui/DepositModal";

type Props = {
    className?: string;
}

export const ChildAccounts = ({className}: Props) => {
    const [isAddMoneyModalActive, setAddMoneyModalActive] = useState(false);
    const [isChangeLimitModalActive, setChangeLimitModalActive] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<ChildAccountType | null>(null);

    const {data: childAccounts = []} = useQuery({
        queryKey: ["child-accounts"],
        queryFn: getChildAccounts,
        refetchInterval: 5000
    });

    function onDepositClick(account: ChildAccountType) {
        setSelectedAccount(account);
        setAddMoneyModalActive(true);
    }

    function onChangeLimitClick(account: ChildAccountType) {
        setSelectedAccount(account);
        setChangeLimitModalActive(true);
    }

    return <section className={`mb-[1.875rem] ${className}`}>
        <div className="mb-2.5">
            <Heading level={2}>Детский счет</Heading>
        </div>
        <ChildAccountsCarousel childAccounts={childAccounts}
                               component={(account) => <ChildAccountExtended account={account}
                                                                             onDepositClick={onDepositClick}
                                                                             onChangeLimitClick={onChangeLimitClick}/>}/>
        <ChangeChildAccountLimit isActive={isChangeLimitModalActive} setActive={setChangeLimitModalActive}
                                 activeAccount={selectedAccount}/>
        <DepositModal isActive={isAddMoneyModalActive} setActive={setAddMoneyModalActive}
                      activeAccountId={selectedAccount?.id} entityName="child-account"
                      mutationFn={depositChildAccount}/>
    </section>
}
