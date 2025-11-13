"use client";

import {AccountAggregate} from "@/entities/account";
import {useQuery} from "@tanstack/react-query";
import {getFamilyFinance} from "@/entities/family/api/api";

type Props = {
    className?: string;
}

const Accounts = ({className}: Props) => {
    const {data: familyFinance = []} = useQuery({
        queryKey: ["family-finance"],
        queryFn: getFamilyFinance,
        refetchInterval: 5000
    });

    return <section className={`flex items-center mb-6 gap-2.5 ${className}`}>
        <AccountAggregate className="flex-1" account={familyFinance[0]}/>
        {familyFinance.length > 1 && <AccountAggregate className="flex-1" account={familyFinance[1]}/>}
    </section>
}

export default Accounts;