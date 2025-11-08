"use client";

import {type GoalType} from "@/entities/goal/model/types";
import Image from "next/image";
import ProgressBar from "@/shared/ui/ProgressBar";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";
import Date from "@/shared/ui/typography/Date";
import {FlashOn} from "@/shared/ui/icons/FlashOn";
import SwipeForDelete from "@/shared/ui/SwipeForDelete";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteGoal} from "@/entities/goal";
import {usePopup} from "@/providers/GlobalPopupProvider";
import {Delete} from "@/shared/ui/icons/Delete";

type Props = {
    goal: GoalType;
}

export const Goal = ({goal}: Props) => {
    const {showPopup, closePopup} = usePopup();
    const queryClient = useQueryClient();

    const {mutate: removeGoal, isPending} = useMutation({
        mutationFn: deleteGoal,
        onSuccess: () => {
            closePopup();
            queryClient.invalidateQueries({queryKey: ["goals"]});
        },
    });

    function onDelete() {
        showPopup({
            text: "Удаление цели...",
            background: "var(--error-color)",
            icon: () => <Delete />,
        });
        removeGoal(goal.id);
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
                        {goal.avatar
                            ? <Image className="p-3" src={`/images/categories/${goal.avatar}.png`} alt={goal.name}
                                     fill sizes="50px"/>
                            : <FlashOn/>
                        }
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className="text-primary font-medium text-ellipsis overflow-hidden whitespace-nowrap">{goal.name}</p>
                        <Date date={goal.deadline}/>
                    </div>
                    <div className="shrink-0 ml-auto flex flex-col items-end">
                        <p className="leading-none mb-1 font-bold text-lg xxs:text-xl">
                            <MoneyAmount value={goal.moneyCollected}/>
                        </p>
                        <p className="text-light text-[0.6rem] self-end">
                            из <MoneyAmount showCurrency={false} value={goal.moneyNeed}/>
                        </p>
                        <div className="w-20">
                            <ProgressBar value={goal.moneyCollected} max={goal.moneyNeed}/>
                        </div>
                    </div>
                </motion.div>
            </motion.article>
        </SwipeForDelete>
    </div>
}
