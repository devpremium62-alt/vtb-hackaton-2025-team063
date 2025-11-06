"use client";

import {motion} from "framer-motion";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import ProgressBar from "@/shared/ui/ProgressBar";
import {LimitType} from "@/entities/limit";
import {ExpenseCategoryAvatar} from "@/entities/expense-category";
import {Status} from "@/entities/limit/ui/Status";

type Props = {
    item: LimitType;
}

export const WalletItem = ({item}: Props) => {
    const percent = Math.round((item.category.spent / item.limit) * 100);
    const isOverflow = percent >= 100;

    return <article className="bg-tertiary rounded-xl py-3.5 px-1.5">
        <motion.div className="flex items-center justify-start gap-2"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.3}}>
            <ExpenseCategoryAvatar expenseCategory={item.category}/>
            <div className="flex flex-col min-w-0">
                <p className="text-primary font-medium text-ellipsis overflow-hidden whitespace-nowrap">{item.category.name}</p>
                <p className="text-light text-xs">
                    <span>Осталось </span>
                    <MoneyAmount value={item.category.spent}/>
                    <span> из </span>
                    <MoneyAmount value={item.limit}/>
                </p>
            </div>
            <div className="shrink-0 ml-auto flex flex-col items-end">
                <p className={`leading-none font-bold text-xl mb-2${isOverflow ? ' text-error' : ''}`}>
                    {percent}%
                </p>
                <div className="w-20 mb-1.5">
                    <ProgressBar value={item.category.spent} max={item.limit} indicators={true}/>
                </div>
                <Status percent={percent}/>
            </div>
        </motion.div>
    </article>
}

