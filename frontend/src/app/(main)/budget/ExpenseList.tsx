"use client";

import Heading from "@/shared/ui/typography/Heading";
import {TransactionLight, getTransactions, toExcelData} from "@/entities/transaction";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";
import React from "react";
import usePagination from "@/shared/hooks/usePagination";
import Pagination from "@/shared/ui/Pagination";
import {exportToExcel} from "@/shared/lib/exportToExcel";
import {Export} from "@/shared/ui/icons/Export";
import {useQuery} from "@tanstack/react-query";

type Props = {
    className?: string;
}

const TransactionList = ({className}: Props) => {
    const {data: transactions = []} = useQuery({
        queryKey: ["transactions"],
        queryFn: getTransactions,
        refetchInterval: 5000
    });

    const [currenttransactions, {setPage, firstPage, lastPage}] = usePagination(transactions, 5);
    const isShowindSkeletons = useShowingSkeleton(transactions);

    return <section className={`${className} mb-[1.875rem] md:p-3 md:rounded-2xl md:bg-neutral-100`}>
        <div className="mb-2.5 flex justify-between items-center flex-wrap gap-x-2">
            <div className="flex items-center gap-2">
                <Heading className="mb-1" level={2}>История операций</Heading>
                <button onClick={() => exportToExcel(toExcelData(transactions))} className="text-inactive">
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
                {currenttransactions.map((transaction) => (<TransactionLight key={transaction.id} transaction={transaction}/>))}
            </div>
        }
    </section>
}

export default TransactionList;