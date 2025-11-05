import {ExpenseType} from "@/entities/expense";
import {ExpenseCategoryAvatar} from "@/entities/expense-category";
import Date from "@/shared/ui/typography/Date";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";

type Props = {
    expense: ExpenseType;
}

export const Expense = ({expense}: Props) => {
    return <motion.article className="flex items-center justify-between p-1.5"
                           initial={{opacity: 0, y: 10}}
                           animate={{opacity: 1, y: 0}}
                           exit={{opacity: 0, y: -10}}
                           transition={{duration: 0.3}}>
        <div className="flex items-center gap-2 min-w-0">
            <ExpenseCategoryAvatar expenseCategory={expense.category}/>
            <div className="flex flex-col min-w-0">
                <p className="text-base font-medium min-w-0 text-ellipsis overflow-hidden whitespace-nowrap">{expense.name}</p>
                <Date date={expense.date}/>
            </div>
        </div>
        <div className="shrink-0 flex flex-col items-end">
            <p className={`text-base font-semibold ${expense.outcome ? "text-error" : "text-success"}`}>
                {expense.outcome ? "-" : "+"}<MoneyAmount value={expense.value}/>
            </p>
            <span className="text-[0.5rem] px-2 py-0.5 rounded-xl font-semibold"
                  style={{backgroundColor: expense.category.color}}>{expense.category.name}</span>
        </div>
    </motion.article>
}