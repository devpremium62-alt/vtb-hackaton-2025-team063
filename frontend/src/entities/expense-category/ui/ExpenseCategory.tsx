"use client";

import {ExpenseCategoryType} from "@/entities/expense-category";
import Image from "next/image";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";

type Props = {
    expenseCategory: ExpenseCategoryType;
    overflowText?: boolean;
}

export const ExpenseCategory = ({expenseCategory, overflowText = true}: Props) => {
    return <motion.div initial={{opacity: 0}} animate={{opacity: 1}}
                       transition={{duration: 0.3, ease: 'easeOut'}}
                       style={{backgroundColor: expenseCategory.color}}
                       className="rounded-[1.875rem] py-2.5 px-2 xxs:px-4 flex items-center justify-between">
        <div className="min-w-0 flex flex-1 items-center justify-between mr-2">
            <div className="shrink-0 w-3 h-3 xxs:w-4 xxs:h-4 relative mr-1 xxs:mr-2">
                <Image src={`/images/categories/${expenseCategory.icon}`} alt={expenseCategory.name} fill sizes="12px"/>
            </div>
            <p className={`flex-1 text-xs xxs:text-base font-medium min-w-0 ${overflowText ? "overflow-hidden text-ellipsis whitespace-nowrap" : ""}`}>{expenseCategory.name}</p>
        </div>
        <div className="shrink-0">
            <p className="text-secondary mt-[0.1rem] text-[0.5rem] xxs:text-xs font-medium">
                <MoneyAmount value={expenseCategory.spent}/>
            </p>
        </div>
    </motion.div>
}