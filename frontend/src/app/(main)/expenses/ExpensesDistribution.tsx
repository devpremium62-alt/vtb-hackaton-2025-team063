"use client";

import Heading from "@/shared/ui/typography/Heading";
import React from "react";
import DonutChart from "@/shared/ui/charts/DonutChart";
import Image from "next/image";
import getAbsoluteSeverUrl from "@/shared/lib/getAbsoluteServerUrl";
import {useQuery} from "@tanstack/react-query";
import {getFamilyExpenses} from "@/entities/family/api/api";

type Props = {
    firstAvatar: string;
    secondAvatar: string;
    className?: string;
}

const ExpensesDistributions = ({firstAvatar, secondAvatar, className}: Props) => {
    const {data: expenseCategories = []} = useQuery({
        queryKey: ["family-expenses"],
        queryFn: getFamilyExpenses,
        refetchInterval: 5000
    });

    const firstPersonData = [{
        value: expenseCategories[0].expenses,
        color: "var(--primary-color)",
        label: true
    }];

    const secondPersonData = [{
        value: expenseCategories[0].expenses,
        color: "var(--icons-inactive)",
        label: false
    }];

    if (expenseCategories.length > 1) {
        firstPersonData.push({value: expenseCategories[1].expenses, color: "var(--icons-inactive)", label: false});
        secondPersonData.push({value: expenseCategories[1].expenses, color: "var(--primary-color)", label: true});
    }

    return <section className={`mb-[1.875rem] ${className}`}>
        <div className="mb-2.5">
            <Heading level={2}>Распределение трат</Heading>
        </div>
        <div className="flex items-center flex-col xxs:flex-row">
            <DonutChart clickable={false} data={firstPersonData} size={80} height={200}>
                <Image className="rounded-full w-12 h-12 object-cover" width={48} height={48}
                       src={getAbsoluteSeverUrl(firstAvatar)}
                       alt=""/>
            </DonutChart>
            <DonutChart clickable={false} data={secondPersonData} size={80} height={200}>
                <Image className="rounded-full w-12 h-12 object-cover" width={48} height={48}
                       src={getAbsoluteSeverUrl(secondAvatar)}
                       alt=""/>
            </DonutChart>
        </div>
    </section>;
}

export default ExpensesDistributions;