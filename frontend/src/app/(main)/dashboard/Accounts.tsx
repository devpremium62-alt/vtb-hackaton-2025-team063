"use client";

import {AccountAggregate, getPersonalAccounts} from "@/entities/account";
import {useQuery} from "@tanstack/react-query";

const Accounts = () => {
    const {data: personalAccounts = null} = useQuery({
        queryKey: ["personal-accounts"],
        queryFn: getPersonalAccounts,
        refetchInterval: 5000
    });

    const persons = Object.values(personalAccounts || {});

    if (!persons[0] || !persons[1]) {
        return null;
    }

    return <section className="flex items-center mb-6 gap-2.5 mx-4 md:mr-0">
        <AccountAggregate className="flex-1" account={persons[0]}/>
        <AccountAggregate className="flex-1" account={persons[1]}/>
    </section>
}

export default Accounts;