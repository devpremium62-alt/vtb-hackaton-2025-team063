"use client";

import {ExpenseType} from "@/entities/expense";
import {ExpenseCategoryAvatar} from "@/entities/expense-category";
import Date from "@/shared/ui/typography/Date";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";
import {BankTag} from "@/entities/expense/ui/BankTag";
import {useDraggable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";

type Props = {
    expense: ExpenseType;
};

export const Expense = ({expense}: Props) => {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: expense.id,
        data: {expense},
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.6 : 1,
        cursor: "grab",
        zIndex: isDragging ? 100 : 1,
        position: "relative" as const,
        touchAction: "none" as const,
        background: isDragging ? "var(--bg-tertiary)" : "none"
    };

    return (
        <motion.article
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            transition={{duration: 0.3}}>
            <div ref={setNodeRef}
                 {...listeners}
                 {...attributes}
                 style={style} className="flex items-center justify-between p-1.5 rounded-xl active:cursor-grabbing">
                <div className="flex items-center gap-2 min-w-0">
                    <ExpenseCategoryAvatar expenseCategory={expense.category}/>
                    <div className="flex flex-col min-w-0">
                        <p className="text-base font-medium min-w-0 text-ellipsis overflow-hidden whitespace-nowrap">
                            {expense.name}
                        </p>
                        <div className="flex gap-1">
                            <BankTag bank={expense.bank}/>
                            <Date date={expense.date}/>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 flex flex-col items-end">
                    <p className={`text-base font-semibold ${expense.outcome ? "text-error" : "text-success"}`}>
                        {expense.outcome ? "-" : "+"}
                        <MoneyAmount value={expense.value}/>
                    </p>
                    <span className="text-[0.5rem] px-2 py-0.5 rounded-xl font-semibold"
                          style={{backgroundColor: expense.category.color}}>
                    {expense.category.name}
                </span>
                </div>
            </div>

        </motion.article>
    );
};