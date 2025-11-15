"use client";

import {type TransactionType, Transaction, toExcelData} from "@/entities/transaction";
import Heading from "@/shared/ui/typography/Heading";
import React from "react";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";
import usePagination from "@/shared/hooks/usePagination";
import Pagination from "@/shared/ui/Pagination";
import {Export} from "@/shared/ui/icons/Export";
import {exportToExcel} from "@/shared/lib/exportToExcel";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import {Cancel} from "@/shared/ui/icons/Cancel";
import CollectionEmptyWithIcon from "@/shared/ui/CollectionEmptyWithIcon";

type Props = {
    transactions: TransactionType[];
}

const TransactionHistory = ({transactions}: Props) => {
    const [currentTransactions, {setPage, firstPage, lastPage}] = usePagination(transactions, 5);

    const isShowindSkeletons = useShowingSkeleton(transactions);

    return <section className="mx-4 md:mx-0 md:ml-4 mb-[1.875rem] md:p-3 md:rounded-2xl md:bg-violet-50">
        <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-2">
                <Heading level={2}>История трат</Heading>
                <button onClick={() => exportToExcel(toExcelData(transactions))} className="text-inactive">
                    <Export/>
                </button>
            </div>
            <Pagination setPage={setPage} firstPage={firstPage} lastPage={lastPage}/>
        </div>
        <div className="flex flex-col gap-2.5">
            {isShowindSkeletons
                ? Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="bg-tertiary md:bg-violet-100/75! h-16 rounded-xl animate-pulse"></div>))
                : currentTransactions.length
                    ? currentTransactions.map((transaction) => (<Transaction key={transaction.id} transaction={transaction}/>))
                    : <CollectionEmptyWithIcon className="py-6">Пока что здесь ничего нет</CollectionEmptyWithIcon>
            }
        </div>
    </section>;
}

export default TransactionHistory;