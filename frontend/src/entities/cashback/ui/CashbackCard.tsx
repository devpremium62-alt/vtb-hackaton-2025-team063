import {CashbackType} from "@/entities/cashback";
import { motion } from "framer-motion";
import getAbsoluteSeverUrl from "@/shared/lib/getAbsoluteServerUrl";
import Avatar from "@/shared/ui/Avatar";
import 'dayjs/locale/ru';
import dayjs from "dayjs";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {useMemo} from "react";

type Props = {
    cardWithCashback: CashbackType;
    avatar: string;
}

export const CashbackCard = ({cardWithCashback, avatar}: Props) => {
    const total = useMemo(() => {
        return cardWithCashback.cashback.reduce((acc, cashback) => acc + cashback.cashback, 0);
    }, [cardWithCashback]);

    return <div className="bg-primary-light rounded-xl px-2.5 py-2">
        <motion.div initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3}}>
            <div className="flex items-start justify-between mb-3.5">
                <Avatar avatar={getAbsoluteSeverUrl(avatar)} />
                <p className="text-[#B9CADB] font-bold text-lg">{cardWithCashback.card.slice(-4)}</p>
            </div>
            <div>
                <p className="text-base text-[#B9CADB]">Накоплено за {dayjs(Date.now()).locale('ru').format('MMMM')}</p>
                <p className="text-active text-[1.875rem] font-bold leading-none">
                    <MoneyAmount value={total}/>
                </p>
            </div>
        </motion.div>
    </div>
}