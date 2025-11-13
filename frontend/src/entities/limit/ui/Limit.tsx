"use client";

import {motion} from "framer-motion";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import ProgressBar from "@/shared/ui/ProgressBar";
import {deleteLimit, LimitType} from "@/entities/limit";
import {TransactionCategoryAvatar} from "@/entities/transaction-category";
import SwipeForDelete from "@/shared/ui/SwipeForDelete";
import {useQueryClient} from "@tanstack/react-query";
import useDelete from "@/shared/hooks/useDelete";

type Props = {
    limit: LimitType;
}

export const Limit = ({limit}: Props) => {
    const percent = Math.round((limit.spent / limit.limit) * 100);
    const isOverflow = percent >= 100;

    const queryClient = useQueryClient();
    const onDelete = useDelete(limit.id, deleteLimit, onSuccess, "Удаление лимита...");

    function onSuccess() {
        queryClient.invalidateQueries({queryKey: ["limits"]});
    }

    return <div className="relative overflow-hidden">
        <SwipeForDelete onDelete={onDelete}>
            <motion.article className="bg-tertiary md:bg-sky-100/75! rounded-xl p-1.5"
                            exit={{opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0}}
                            transition={{duration: 0.3}}
                            layout>
                <motion.div className="flex items-center justify-start gap-2"
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3}}>
                    <TransactionCategoryAvatar categoryId={limit.category}/>
                    <div className="flex flex-col min-w-0">
                        <p className="text-primary font-medium text-ellipsis overflow-hidden whitespace-nowrap">{limit.name}</p>
                        <p className="text-light font-light text-xs">
                            <MoneyAmount value={limit.spent} showCurrency={false}/>
                            <span> из </span>
                            <MoneyAmount value={limit.limit} showCurrency={false}/>
                        </p>
                    </div>
                    <div className="shrink-0 ml-auto flex flex-col items-end">
                        <p className={`leading-none font-bold text-xl mb-2${isOverflow ? ' text-error' : ''}`}>
                            {percent}%
                        </p>
                        <div className="w-20">
                            <ProgressBar value={limit.spent} max={limit.limit} indicators={true}/>
                        </div>
                    </div>
                </motion.div>
            </motion.article>
        </SwipeForDelete>
    </div>
}