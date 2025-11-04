"use client";

import Heading from "@/shared/ui/typography/Heading";
import CoupleAvatars from "@/shared/ui/CoupleAvatars";
import DonutChart from "@/shared/ui/charts/DonutChart";
import {ExpenseCategory, ExpenseCategoryType} from "@/entities/expense-category";
import React, {useMemo} from "react";
import 'dayjs/locale/ru';
import dayjs from "dayjs";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";

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

    const isShowingSkeleton = useShowingSkeleton(expenseCategories);

    return <section className="ml-4 md:mx-0 md:mr-4 mb-[1.875rem]">
        <div className="flex items-center justify-between mr-4 mb-2.5">
            <Heading level={2}>Общие траты за {dayjs(Date.now()).locale('ru').format('MMMM')}</Heading>
            <CoupleAvatars firstAvatar={firstAvatar} secondAvatar={secondAvatar}/>
        </div>
        <div className="flex items-start">
            {isShowingSkeleton
                ? <>
                    <div className="w-1/2 flex-1 h-[8.75rem] rounded-xl bg-tertiary animate-pulse mr-1"></div>
                    <div className="w-1/2 flex-1 flex flex-col gap-1 mr-4">
                        {Array.from({length: 3}).map((_, i) => (
                            <div key={i} className="h-11 rounded-xl bg-tertiary animate-pulse"/>
                        ))}
                    </div>
                </>
                : <>
                    <DonutChart data={chartData}/>
                    <div className="w-1/2 right-blurred">
                        <div className="overflow-x-auto">
                            <div className="grid grid-flow-col auto-rows-max gap-1"
                                 style={{gridTemplateRows: "repeat(3, auto)", gridAutoColumns: "90%"}}>
                                {sortedCategories.map(category => (
                                    <ExpenseCategory key={category.name} expenseCategory={category}/>
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
    </section>;
}

export default SharedExpenses;