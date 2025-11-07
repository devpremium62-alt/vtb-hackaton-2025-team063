import {ExpenseType} from "@/entities/expense";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";
import {BankTag} from "@/entities/expense/ui/BankTag";
import Date from "@/shared/ui/typography/Date";

type Props = {
    expense: ExpenseType;
}

export const ExpenseLight = ({expense}: Props) => {
    return <motion.article className="flex items-center justify-between py-2.5 border-b-1 border-gray-200"
                           initial={{opacity: 0, y: 10}}
                           animate={{opacity: 1, y: 0}}
                           exit={{opacity: 0, y: -10}}
                           transition={{duration: 0.3}}>
        <div className="flex flex-col min-w-0">
            <p className="text-lg font-semibold min-w-0 text-ellipsis overflow-hidden whitespace-nowrap">{expense.name}</p>
            <div className="flex gap-1">
                <BankTag bank={expense.bank}/>
                <Date date={expense.date}/>
            </div>
        </div>
        <div className="shrink-0 flex flex-col items-end">
            <p className={`text-sm ${expense.outcome ? "text-error" : "text-success"}`}>
                {expense.outcome ? "-" : "+"}<MoneyAmount value={expense.value}/>
            </p>
        </div>
    </motion.article>
}