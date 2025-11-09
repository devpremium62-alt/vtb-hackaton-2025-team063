"use client";

import Heading from "@/shared/ui/typography/Heading";
import {ExpenseLight, getExpenses, toExcelData} from "@/entities/expense";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";
import React from "react";
import usePagination from "@/shared/hooks/usePagination";
import Pagination from "@/shared/ui/Pagination";
import {exportToExcel} from "@/shared/lib/exportToExcel";
import {Export} from "@/shared/ui/icons/Export";
import {useQuery} from "@tanstack/react-query";

const ExpenseList = () => {
    const {data: expenses = []} = useQuery({
        queryKey: ["expenses"],
        queryFn: getExpenses,
        refetchInterval: 5000
    });

    const [currentExpenses, {setPage, firstPage, lastPage}] = usePagination(expenses, 5);
    const isShowindSkeletons = useShowingSkeleton(expenses);

    return <section className="mx-4 md:ml-0 mb-20">
        <div className="mb-2.5 flex justify-between items-center flex-wrap gap-x-2">
            <div className="flex items-center gap-2">
                <Heading level={2}>История операций</Heading>
                <button onClick={() => exportToExcel(toExcelData(expenses))} className="text-inactive">
                    <Export/>
                </button>
            </div>
            <Pagination setPage={setPage} firstPage={firstPage} lastPage={lastPage}/>
        </div>

        {isShowindSkeletons
            ? <div className="flex flex-col gap-1">
                {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="bg-tertiary h-14 rounded-xl animate-pulse"></div>))}
            </div>
            : <div className="flex flex-col">
                {currentExpenses.map((expense) => (<ExpenseLight key={expense.id} expense={expense}/>))}
            </div>
        }
    </section>
}

export default ExpenseList;