"use client";

import {motion} from "framer-motion";
import Image from "next/image";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import ProgressBar from "@/shared/ui/ProgressBar";
import {LimitType} from "@/entities/limit";
import {ExpenseCategoryAvatar} from "@/entities/expense-category";
import SwipeForDelete from "@/shared/ui/SwipeForDelete";

type Props = {
    limit: LimitType;
}

export const Limit = ({limit}: Props) => {
    const percent = Math.round((limit.category.spent / limit.limit) * 100);
    const isOverflow = percent >= 100;

    return <div className="relative overflow-hidden">
        <SwipeForDelete onDelete={() => {}}>
            <article className="bg-tertiary rounded-xl p-1.5">
                <motion.div className="flex items-center justify-start gap-2"
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3}}>
                    <ExpenseCategoryAvatar expenseCategory={limit.category}/>
                    <div className="flex flex-col min-w-0">
                        <p className="text-primary font-medium text-ellipsis overflow-hidden whitespace-nowrap">{limit.category.name}</p>
                        <p className="text-light font-light text-xs">
                            <MoneyAmount value={limit.category.spent} showCurrency={false}/>
                            <span> из </span>
                            <MoneyAmount value={limit.limit} showCurrency={false}/>
                        </p>
                    </div>
                    <div className="shrink-0 ml-auto flex flex-col items-end">
                        <p className={`leading-none font-bold text-xl mb-2${isOverflow ? ' text-error' : ''}`}>
                            {percent}%
                        </p>
                        <div className="w-20">
                            <ProgressBar value={limit.category.spent} max={limit.limit} indicators={true}/>
                        </div>
                    </div>
                </motion.div>
            </article>
        </SwipeForDelete>
    </div>
}