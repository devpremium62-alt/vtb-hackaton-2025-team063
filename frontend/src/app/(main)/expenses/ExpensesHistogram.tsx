"use client";

import Histogram from "@/shared/ui/charts/Histogram";
import {TransactionCategories, TransactionCategory, TransactionCategoryType} from "@/entities/transaction-category";
import React, {useMemo, useState} from "react";
import {Info} from "@/shared/ui/icons/Info";
import InfoPopup from "@/shared/ui/popups/InfoPopup";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import {Cancel} from "@/shared/ui/icons/Cancel";
import CollectionEmptyWithIcon from "@/shared/ui/CollectionEmptyWithIcon";

type Props = {
    expenseCategories: TransactionCategoryType[];
}

const ExpensesHistogram = ({expenseCategories}: Props) => {
    const [isHelpActive, setHelpActive] = useState(false);

    const nonEmptyCategories = useMemo(() => {
        return expenseCategories.filter(c => c.spent !== 0);
    }, [expenseCategories]);

    const histogramData = useMemo(() => {
        return expenseCategories.map(cat => ({id: cat.id, value: cat.spent, color: TransactionCategories[cat.id].color, name: cat.name}));
    }, [expenseCategories]);

    const isLoading = useShowingSkeleton(expenseCategories);

    if (!nonEmptyCategories.length) {
        return <CollectionEmptyWithIcon className="pt-2 pb-6">Пока что здесь ничего нет</CollectionEmptyWithIcon>;
    }

    return <>
        <div className="mb-2.5 relative">
            <Histogram data={histogramData}/>
            {!isHelpActive && !isLoading &&
                <button onClick={() => setHelpActive(true)} className="w-5 h-5 absolute -top-6 right-0 text-[#C4C4C4] cursor-pointer">
                    <Info/>
                </button>
            }

            <InfoPopup top={-1} text="Зажмите и перетащите операцию для изменения категории" time={2000}
                       isActive={isHelpActive}
                       setActive={setHelpActive}/>
        </div>
        <div className="flex items-center justify-start gap-1 flex-wrap">
            {nonEmptyCategories.map(cat => (
                <TransactionCategory key={cat.name} overflowText={false} transactionCategory={cat}/>
            ))}
        </div>
    </>
}

export default ExpensesHistogram;