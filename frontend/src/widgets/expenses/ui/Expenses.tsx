"use client";

import DonutChart from "@/shared/ui/charts/DonutChart";
import {TransactionCategories, TransactionCategory, TransactionCategoryType} from "@/entities/transaction-category";
import React, {useMemo} from "react";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";

type Props = {
    expenseCategories: TransactionCategoryType[];
}

export const Expenses = ({expenseCategories}: Props) => {
    const filteredCategories = useMemo(() => {
        return expenseCategories.filter(c => c.spent !== 0);
    }, [expenseCategories])

    const sortedCategories = useMemo(() => {
        return [...filteredCategories].sort((c1, c2) => c2.spent - c1.spent);
    }, [filteredCategories]);

    const chartData = useMemo(() => {
        return [...sortedCategories].reverse().map(c => ({value: c.spent, color: TransactionCategories[c.id].color}));
    }, [sortedCategories]);

    const isShowingSkeleton = useShowingSkeleton(expenseCategories);

    return <div className="flex md:flex-col md:gap-4 md:items-center items-start">
        {isShowingSkeleton
            ? <>
                <div className="w-1/2 md:w-full flex-1 h-[8.75rem] rounded-xl bg-tertiary animate-pulse mr-1"></div>
                <div className="w-1/2 md:w-full flex-1 flex flex-col gap-1 mr-4">
                    {Array.from({length: 3}).map((_, i) => (
                        <div key={i} className="h-11 rounded-xl bg-tertiary md:bg-fuchsia-100/75! animate-pulse"/>
                    ))}
                </div>
            </>
            : <>
                <div className="w-1/2">
                    <DonutChart data={chartData}/>
                </div>
                <div className="w-1/2 md:w-full right-blurred md:after:hidden">
                    <div className="overflow-x-auto">
                        <div
                            className="grid grid-flow-col auto-rows-max gap-1 auto-cols-[90%] md:auto-cols-auto"
                            style={{gridTemplateRows: "repeat(3, auto)"}}>
                            {sortedCategories.map(category => (
                                <TransactionCategory key={category.name} transactionCategory={category}/>
                            ))}
                            {Array.from({length: 3}).map((_, i) => (
                                <div key={i} className="w-4"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        }
    </div>
}

export default Expenses;