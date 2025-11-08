"use client";

import {motion} from "framer-motion";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import ProgressBar from "@/shared/ui/ProgressBar";
import {ExpenseCategoryAvatar} from "@/entities/expense-category";
import {Status} from "@/entities/limit/ui/Status";
import SwipeForDelete from "@/shared/ui/SwipeForDelete";
import {WalletType} from "@/entities/wallet";

type Props = {
    item: WalletType;
};

export const WalletItem = ({item}: Props) => {
    const percent = Math.round((item.spent / item.limit) * 100);
    const isOverflow = percent >= 100;

    return (
        <div className="relative overflow-hidden">
            <SwipeForDelete onDelete={() => {}}>
                <motion.div
                    className="flex items-center justify-start gap-2 px-2.5 py-3"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.3}}
                >
                    <ExpenseCategoryAvatar expenseCategory={item.category}/>
                    <div className="flex flex-col min-w-0">
                        <p className="text-primary font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                            {item.category.name}
                        </p>
                        <p className="text-light font-light text-xs flex items-center gap-[0.15rem]">
                            <span className="hidden xxs:inline-block">Осталось</span>
                            <span><MoneyAmount value={Math.max(0, item.limit - item.spent)}/></span>
                            <span>из</span>
                            <span><MoneyAmount value={item.limit}/></span>
                        </p>
                    </div>
                    <div className="shrink-0 ml-auto flex flex-col items-end">
                        <p className={`leading-none font-bold text-xl mb-2${isOverflow ? " text-error" : ""}`}>
                            {percent}%
                        </p>
                        <div className="w-20 mb-1.5">
                            <ProgressBar value={item.spent} max={item.limit} indicators/>
                        </div>
                        <Status percent={percent}/>
                    </div>
                </motion.div>
            </SwipeForDelete>
        </div>
    );
};