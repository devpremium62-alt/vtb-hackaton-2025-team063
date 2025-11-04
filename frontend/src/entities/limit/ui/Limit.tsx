"use client";

import {motion} from "framer-motion";
import Image from "next/image";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import ProgressBar from "@/shared/ui/ProgressBar";
import {LimitType} from "@/entities/limit";

type Props = {
    limit: LimitType;
}

export const Limit = ({limit}: Props) => {
    const percent = Math.round((limit.category.spent / limit.limit) * 100);
    const isOverflow = percent >= 100;

    return <article className="bg-tertiary rounded-xl p-1.5">
        <motion.div className="flex items-center justify-start gap-2"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.3}}>
            <div className="shrink-0 w-[3.125rem] h-[3.125rem] rounded-full relative" style={{backgroundColor: limit.category.color}}>
                <Image className="p-3" src={`/images/categories/${limit.category.icon}`} alt={limit.category.name} fill/>
            </div>
            <div className="flex flex-col min-w-0">
                <p className="text-primary font-medium text-ellipsis overflow-hidden whitespace-nowrap">{limit.category.name}</p>
                <p className="text-secondary text-xs">
                    <MoneyAmount value={limit.category.spent} showCurrency={false}/>
                    <span> из </span>
                    <MoneyAmount value={limit.limit} showCurrency={false}/>
                </p>
            </div>
            <div className="shrink-0 ml-auto flex flex-col items-end">
                <p className={`leading-none font-bold text-xl mb-2${isOverflow ? ' text-error' : ''}`}>
                    {percent}%
                </p>
                <div className="w-20">
                    <ProgressBar value={limit.category.spent} max={limit.limit} indicators={true}/>
                </div>
            </div>
        </motion.div>
    </article>
}