import {OneCategoryCashbackType, CashbackType} from "@/entities/cashback";
import {motion} from "framer-motion";
import Avatar from "@/shared/ui/Avatar";
import getAbsoluteSeverUrl from "@/shared/lib/getAbsoluteServerUrl";
import {TransactionCategories, TransactionCategoryAvatar} from "@/entities/transaction-category";
import {BankTag} from "@/entities/transaction/ui/BankTag";
import {banks} from "@/entities/bank";

type Props = {
    cashback: OneCategoryCashbackType;
    userAvatar: string;
    onClick: (category: number) => void;
}

export const BestCashback = ({userAvatar, cashback, onClick}: Props) => {
    return <motion.article className="bg-tertiary rounded-xl py-4 px-1.5 cursor-pointer" onClick={() => onClick(cashback.cashback.category)}>
        <motion.div className="flex items-center justify-between" initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3}}>
            <div className="flex items-center gap-2 min-w-0">
                <div className="flex flex-row-reverse items-center">
                    <TransactionCategoryAvatar className="-ml-6" categoryId={cashback.cashback.category}/>
                    <Avatar avatar={getAbsoluteSeverUrl(userAvatar)} size="3.125"/>
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">{TransactionCategories[cashback.cashback.category].name}</p>
                    <div className="flex items-center flex-wrap gap-1">
                        <BankTag bank={banks[cashback.bank].name}/>
                        <p className="text-light text-xs font-semibold leading-none">{cashback.card.slice(-4)}</p>
                    </div>
                </div>
            </div>
            <div className="shrink-0 flex flex-col items-end">
                <p className="text-info text-2xl font-bold">{cashback.cashback.percents}%</p>
                <p className="text-light text-xs">Действует до <time>{cashback.cashback.date.toLocaleDateString()}</time></p>
            </div>
        </motion.div>
    </motion.article>
}