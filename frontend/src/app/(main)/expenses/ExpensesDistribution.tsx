"use client";

import Heading from "@/shared/ui/typography/Heading";
import React from "react";
import DonutChart from "@/shared/ui/charts/DonutChart";
import Image from "next/image";
import getAbsoluteSeverUrl from "@/shared/lib/getAbsoluteServerUrl";
import {useQuery} from "@tanstack/react-query";
import {getFamilyExpenses} from "@/entities/family/api/api";
import CollectionEmptyWithIcon from "@/shared/ui/CollectionEmptyWithIcon";

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
        value: expenseCategories[0] ? expenseCategories[0].expenses : 0,
        color: "var(--primary-color)",
        label: true
    }];

    const secondPersonData = [{
        value: expenseCategories[0] ? expenseCategories[0].expenses : 0,
        color: "var(--icons-inactive)",
        label: false
    }];

    if (expenseCategories[1]) {
        firstPersonData.push({value: expenseCategories[1].expenses, color: "var(--icons-inactive)", label: false});
        secondPersonData.push({value: expenseCategories[1].expenses, color: "var(--primary-color)", label: true});
    }

    return <section className={`mb-[1.875rem] ${className}`}>
        <div className="mb-2.5">
            <Heading level={2}>Распределение трат</Heading>
        </div>
        <div className="flex items-center flex-col xxs:flex-row">
            {
                firstPersonData[0].value
                ? <>
                    <DonutChart clickable={false} data={firstPersonData} size={80} height={200}>
                        <Image className="rounded-full w-12 h-12 object-cover" width={48} height={48}
                               src={getAbsoluteSeverUrl(firstAvatar)}
                               alt=""/>
                    </DonutChart>
                    {expenseCategories[1]
                        ? <DonutChart clickable={false} data={secondPersonData} size={80} height={200}>
                            <Image className="rounded-full w-12 h-12 object-cover" width={48} height={48}
                                   src={getAbsoluteSeverUrl(secondAvatar)}
                                   alt=""/>
                        </DonutChart>
                        : <></>
                    }
                  </>
                : <div className="flex items-center justify-center w-full">
                        <CollectionEmptyWithIcon className="py-6">Пока что здесь ничего нет</CollectionEmptyWithIcon>
                </div>
            }
        </div>
    </section>;
}

export default ExpensesDistributions;