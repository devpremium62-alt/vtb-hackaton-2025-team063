"use client";

import {TransactionType} from "@/entities/transaction";
import {TransactionCategoryAvatar, TransactionCategories} from "@/entities/transaction-category";
import Date from "@/shared/ui/typography/Date";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";
import {BankTag} from "@/entities/transaction/ui/BankTag";
import {useDraggable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";

type Props = {
    transaction: TransactionType;
};

export const Transaction = ({transaction}: Props) => {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: transaction.id,
        data: {transaction},
    });

    const enableDrag = transaction.outcome;

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.6 : 1,
        cursor: enableDrag ? "grab" : "auto",
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
            <div ref={enableDrag ? setNodeRef : null}
                 {...(enableDrag ? listeners : [])}
                 {...(enableDrag ? attributes : [])}
                 style={style} className={`flex items-center justify-between p-1.5 rounded-xl ${enableDrag ? "active:cursor-grabbing" : ""}`}>
                <div className="flex items-center gap-2 min-w-0">
                    <TransactionCategoryAvatar categoryId={transaction.category.id}/>
                    <div className="flex flex-col min-w-0">
                        <p className="text-base font-medium min-w-0 text-ellipsis overflow-hidden whitespace-nowrap">
                            {transaction.name}
                        </p>
                        <div className="flex gap-1">
                            <BankTag bank={transaction.bank}/>
                            <Date date={transaction.date}/>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 flex flex-col items-end">
                    <p className={`text-base font-semibold ${transaction.outcome ? "text-error" : "text-success"}`}>
                        {transaction.outcome ? "-" : "+"}
                        <MoneyAmount value={transaction.value}/>
                    </p>
                    <span className="text-[0.5rem] px-2 py-0.5 rounded-xl font-semibold"
                          style={{backgroundColor: TransactionCategories[transaction.category.id].color}}>
                    {transaction.category.name}
                </span>
                </div>
            </div>
        </motion.article>
    );
};