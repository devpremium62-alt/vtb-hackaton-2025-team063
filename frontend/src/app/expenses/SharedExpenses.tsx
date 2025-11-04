"use client";

import Heading from "@/shared/ui/typography/Heading";
import CoupleAvatars from "@/shared/ui/CoupleAvatars";
import DonutChart from "@/shared/ui/DonutChart";
import {ExpenseCategory, ExpenseCategoryType} from "@/entities/expense-category";
import React, {useEffect, useMemo, useState} from "react";

type Props = {
    firstAvatar: string;
    secondAvatar: string;
    expenseCategories: ExpenseCategoryType[];
}

const SharedExpenses = ({firstAvatar, secondAvatar, expenseCategories}: Props) => {
    const sortedCategories = useMemo(() => {
        return [...expenseCategories].sort((c1, c2) => c2.spent - c1.spent);
    }, [expenseCategories]);
    const chartData = useMemo(() => {
        return [...sortedCategories].reverse().map(c => ({name: c.name, value: c.spent, color: c.color}));
    }, [sortedCategories]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 0);
        return () => clearTimeout(t);
    }, [expenseCategories]);

    return <section className="ml-4 md:mx-0 md:mr-4 mb-5">
        <div className="flex items-center justify-between mr-4 mb-2.5">
            <Heading level={2}>Общие траты</Heading>
            <CoupleAvatars firstAvatar={firstAvatar} secondAvatar={secondAvatar}/>
        </div>
        <div className="flex gap-2 items-start">
            {isLoading
                ? <>
                    <div className="w-1/2 flex-1 h-32 rounded-xl bg-tertiary animate-pulse"></div>
                    <div className="w-1/2 flex-1 flex flex-col gap-1 mr-4">
                        {Array.from({length: 3}).map((_, i) => (
                            <div key={i} className="h-10 rounded-xl bg-tertiary animate-pulse"/>
                        ))}
                    </div>
                </>
                : <>
                    <DonutChart data={chartData}/>
                    <div className="w-1/2 right-blurred">
                        <div className="overflow-x-auto">
                            <div className="grid grid-flow-col auto-rows-max gap-1"
                                 style={{gridTemplateRows: "repeat(3, auto)", gridAutoColumns: "max-content"}}>
                                {sortedCategories.map(category => (
                                    <ExpenseCategory key={category.name} expenseCategory={category}/>
                                ))}
                                {Array.from({length: 3}).map(() => (
                                    <div className="w-4"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    </section>;
}

export default SharedExpenses;