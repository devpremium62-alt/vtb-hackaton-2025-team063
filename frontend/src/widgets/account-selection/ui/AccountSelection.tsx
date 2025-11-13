import {useQuery} from "@tanstack/react-query";
import {AnimatePresence} from "framer-motion";
import {Account, getAccounts} from "@/entities/account";
import {useEffect, useMemo, useState} from "react";
import {AccountType} from "@/entities/account/model/types";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import {BankKey} from "@/entities/bank";
import InputError from "@/shared/ui/inputs/InputError";

type Props = {
    error?: string | null;
    value: AccountType | null;
    onChange(account: AccountType | null): void;
    excluded?: string[];
    id?: string;
}

export const AccountSelection = ({error, value, id, onChange, excluded = [], ...props}: Props) => {
    const {data: accounts = []} = useQuery({
        queryKey: ["accounts"],
        queryFn: getAccounts,
        refetchInterval: 5000
    });

    const transformedAccounts = useMemo(() => {
        return (Object.keys(accounts) as BankKey[]).map((bankKey: BankKey) => {
            return (accounts as Record<BankKey, AccountType[]>)[bankKey]
                .filter(a => a.accountSubType === "Checking" && !excluded.includes(a.accountId))
                .map(a => ({...a, bankId: bankKey}))
        }).flat(1);
    }, [accounts, excluded]);

    const [selectedAccount, setSelectedAccount] = useState<AccountType | null>(null);

    useEffect(() => {
        setSelectedAccount(value);
    }, [value]);

    function selectAccount(account: AccountType) {
        setSelectedAccount(account);
        onChange(account);
    }

    return <>
        <div id={id} className="grid grid-cols-2 gap-1" {...props}>
            <AnimatePresence>
                {transformedAccounts.length
                    ? transformedAccounts.map((account) => {
                        return <Account key={account.accountId} account={account}
                                        onClick={selectAccount}
                                        selected={selectedAccount?.accountId === account.accountId}/>
                    })
                    : <CollectionEmpty>У вас нет подходящих счетов</CollectionEmpty>
                }
            </AnimatePresence>
        </div>
        <InputError error={error}/>
    </>
}