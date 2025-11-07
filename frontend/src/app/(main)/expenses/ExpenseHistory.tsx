"use client";

import {type ExpenseType, Expense, toExcelData} from "@/entities/expense";
import Heading from "@/shared/ui/typography/Heading";
import React from "react";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";
import usePagination from "@/shared/hooks/usePagination";
import Pagination from "@/shared/ui/Pagination";
import {Export} from "@/shared/ui/icons/Export";
import {exportToExcel} from "@/shared/lib/exportToExcel";

type Props = {
    expenses: ExpenseType[];
}

const ExpenseHistory = ({expenses}: Props) => {
    const [currentExpenses, {setPage, firstPage, lastPage}] = usePagination(expenses, 5);

    const isShowindSkeletons = useShowingSkeleton(expenses);

    return <section className="mx-4 md:mx-0 md:mr-4 mb-[1.875rem]">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Heading level={2}>История трат</Heading>
                <button onClick={() => exportToExcel(toExcelData(expenses))} className="text-inactive">
                    <Export/>
                </button>
            </div>
            <Pagination setPage={setPage} firstPage={firstPage} lastPage={lastPage}/>
        </div>
        <div className="flex flex-col gap-2.5">
            {isShowindSkeletons
                ? Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="bg-tertiary h-16 rounded-xl animate-pulse"></div>))
                : currentExpenses.map((expense) => (<Expense key={expense.id} expense={expense}/>))
            }
        </div>
    </section>;
}

export default ExpenseHistory;