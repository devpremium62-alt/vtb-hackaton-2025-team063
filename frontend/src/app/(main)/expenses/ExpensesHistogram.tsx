"use client";

import Histogram from "@/shared/ui/charts/Histogram";
import {ExpenseCategory, ExpenseCategoryType} from "@/entities/expense-category";
import React, {useMemo} from "react";
import {Info} from "@/shared/ui/icons/Info";
import InfoPopup from "@/shared/ui/popups/InfoPopup";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";

type Props = {
    expenseCategories: ExpenseCategoryType[];
}

const ExpensesHistogram = ({expenseCategories}: Props) => {
    const [isHelpActive, setHelpActive] = React.useState(false);

    const nonEmptyCategories = useMemo(() => {
        return expenseCategories.filter(c => c.spent !== 0);
    }, [expenseCategories]);

    const histogramData = useMemo(() => {
        return expenseCategories.map(cat => ({id: cat.id, value: cat.spent, color: cat.color}));
    }, [expenseCategories]);

    const isLoading = useShowingSkeleton(expenseCategories);

    return <>
        <div className="mb-2.5 relative">
            <Histogram data={histogramData}/>
            {!isHelpActive && !isLoading &&
                <button onClick={() => setHelpActive(true)} className="w-5 h-5 absolute top-0 right-0 text-[#C4C4C4]">
                    <Info/>
                </button>
            }

            <InfoPopup text="Зажмите и перетащите операцию для изменения категории" time={2000} isActive={isHelpActive}
                       setActive={setHelpActive}/>
        </div>
        <div className="flex items-center justify-start gap-1 flex-wrap">
            {nonEmptyCategories.map(cat => (
                <ExpenseCategory key={cat.name} overflowText={false} expenseCategory={cat}/>
            ))}
        </div>
    </>
}

export default ExpensesHistogram;