"use client";

import Heading from "@/shared/ui/typography/Heading";
import {useState} from "react";
import {ChangeChildAccountLimit} from "@/features/change-child-account-limit";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {
    ChildAccountExtended,
    ChildAccountType, depositChildAccount,
    getChildAccounts
} from "@/entities/child-account";
import {ChildAccountsCarousel} from "@/widgets/chil-accounts-carousel";
import {DepositModal} from "@/widgets/deposit-modal/ui/DepositModal";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";

type Props = {
    className?: string;
    childAccountsInitial: ChildAccountType[];
}

export const ChildAccounts = ({className, childAccountsInitial}: Props) => {
    const [isAddMoneyModalActive, setAddMoneyModalActive] = useState(false);
    const [isChangeLimitModalActive, setChangeLimitModalActive] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<ChildAccountType | null>(null);

    const queryClient = useQueryClient();

    const {data: childAccounts = []} = useQuery({
        queryKey: ["child-accounts"],
        initialData: childAccountsInitial,
        queryFn: getChildAccounts,
        refetchInterval: REFETCH_INTERVAL,
        staleTime: REFETCH_INTERVAL
    });

    function onDepositClick(account: ChildAccountType) {
        setSelectedAccount(account);
        setAddMoneyModalActive(true);
    }

    function onChangeLimitClick(account: ChildAccountType) {
        setSelectedAccount(account);
        setChangeLimitModalActive(true);
    }

    function onDepositSuccess() {
        queryClient.invalidateQueries({queryKey: ["child-accounts"]});
        queryClient.invalidateQueries({queryKey: ["child-transactions"]});
        queryClient.invalidateQueries({queryKey: ["child-transaction-categories"]});
        queryClient.invalidateQueries({queryKey: ["wallets"]});
    }

    return <section className={`mb-[1.875rem] ${className}`}>
        <div className="mb-2.5">
            <Heading level={2}>Детские счета</Heading>
        </div>
        <ChildAccountsCarousel childAccounts={childAccounts}
                               component={(account) => <ChildAccountExtended account={account}
                                                                             onDepositClick={onDepositClick}
                                                                             onChangeLimitClick={onChangeLimitClick}/>}/>
        <ChangeChildAccountLimit isActive={isChangeLimitModalActive} setActive={setChangeLimitModalActive}
                                 activeAccount={selectedAccount}/>
        <DepositModal isActive={isAddMoneyModalActive} setActive={setAddMoneyModalActive}
                      activeAccountId={selectedAccount?.id} entityName="child-account"
                      onSuccess={onDepositSuccess} mutationFn={depositChildAccount}/>
    </section>
}
