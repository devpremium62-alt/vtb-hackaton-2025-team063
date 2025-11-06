"use client";

import {type GoalType} from "@/entities/goal/model/types";
import Image from "next/image";
import ProgressBar from "@/shared/ui/ProgressBar";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";
import Date from "@/shared/ui/typography/Date";
import {FlashOn} from "@/shared/ui/icons/FlashOn";

type Props = {
    goal: GoalType;
}

export const Goal = ({goal}: Props) => {
    return <article className="bg-tertiary rounded-xl p-1.5">
        <motion.div className="flex items-center justify-start gap-2"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.3}}>
            <div className="shrink-0 w-[3.125rem] h-[3.125rem] rounded-full relative bg-health text-white flex justify-center items-center">
                {goal.avatar
                    ? <Image className="p-1.5" src={goal.avatar} alt={goal.name} fill sizes="50px"/>
                    : <FlashOn/>
                }
            </div>
            <div className="flex flex-col min-w-0">
                <p className="text-primary font-medium text-ellipsis overflow-hidden whitespace-nowrap">{goal.name}</p>
                <Date date={goal.deadline}/>
            </div>
            <div className="shrink-0 ml-auto flex flex-col">
                <p className="leading-none mb-1 font-bold text-lg xxs:text-xl">
                    <MoneyAmount value={goal.moneyCollected}/>
                </p>
                <p className="text-light text-[0.6rem] self-end">
                    из <MoneyAmount showCurrency={false} value={goal.moneyNeed}/>
                </p>
                <div className="w-20 self-end">
                    <ProgressBar value={goal.moneyCollected} max={goal.moneyNeed}/>
                </div>
            </div>
        </motion.div>
    </article>
}
