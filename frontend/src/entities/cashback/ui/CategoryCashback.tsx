import {CategoryCashbackType} from "@/entities/cashback";
import { motion } from "framer-motion";
import {TransactionCategories, TransactionCategoryAvatar} from "@/entities/transaction-category";
import MoneyAmount from "@/shared/ui/MoneyAmount";

type Props = {
    categoryCashback: CategoryCashbackType;
}

export const CategoryCashback = ({categoryCashback}: Props) => {
    return <div className="bg-tertiary rounded-xl p-1.5">
        <motion.div className="flex items-center gap-1.5" initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3}}>
            <TransactionCategoryAvatar categoryId={categoryCashback.category}/>
            <div className="min-w-0">
                <p className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                    {TransactionCategories[categoryCashback.category].name}
                </p>
                <p className="text-success font-bold text-xl leading-none whitespace-nowrap text-ellipsis overflow-hidden">
                    + <MoneyAmount value={categoryCashback.cashback}/>
                </p>
            </div>
        </motion.div>
    </div>
}