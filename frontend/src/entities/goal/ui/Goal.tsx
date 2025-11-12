"use client";

import {type GoalType} from "@/entities/goal/model/types";
import Image from "next/image";
import ProgressBar from "@/shared/ui/ProgressBar";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";
import Date from "@/shared/ui/typography/Date";
import {FlashOn} from "@/shared/ui/icons/FlashOn";
import SwipeForDelete from "@/shared/ui/SwipeForDelete";
import {useQueryClient} from "@tanstack/react-query";
import {deleteGoal} from "@/entities/goal";
import useDelete from "@/shared/hooks/useDelete";

type Props = {
    goal: GoalType;
}

export const Goal = ({goal}: Props) => {
    const queryClient = useQueryClient();
    const onDelete = useDelete(goal.id, deleteGoal, onSuccess, "Удаление цели...");

    function onSuccess() {
        queryClient.invalidateQueries({queryKey: ["goals"]});
        queryClient.invalidateQueries({queryKey: ["transactions"]});
    }

    return <div className="relative overflow-hidden">
        <SwipeForDelete onDelete={onDelete}>
            <motion.article className="bg-tertiary rounded-xl py-1.5 pl-1.5 pr-2.5"
                     exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                     transition={{ duration: 0.3 }}
                     layout>
                <motion.div className="flex items-center justify-start gap-2"
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.3}}>
                    <div
                        className="shrink-0 w-[3.125rem] h-[3.125rem] rounded-full relative bg-health text-white flex justify-center items-center">
                        {goal.icon
                            ? <Image className="p-3" src={`/images/categories/${goal.icon}.png`} alt={goal.name}
                                     fill sizes="50px"/>
                            : <FlashOn/>
                        }
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className="text-primary font-medium text-ellipsis overflow-hidden whitespace-nowrap">{goal.name}</p>
                        <Date date={goal.date}/>
                    </div>
                    <div className="shrink-0 ml-auto flex flex-col items-end">
                        <p className="leading-none mb-1 font-bold text-lg xxs:text-xl">
                            <MoneyAmount value={goal.collected}/>
                        </p>
                        <p className="text-light text-[0.6rem] self-end">
                            из <MoneyAmount showCurrency={false} value={goal.value}/>
                        </p>
                        <div className="w-20">
                            <ProgressBar value={goal.collected} max={goal.value}/>
                        </div>
                    </div>
                </motion.div>
            </motion.article>
        </SwipeForDelete>
    </div>
}
