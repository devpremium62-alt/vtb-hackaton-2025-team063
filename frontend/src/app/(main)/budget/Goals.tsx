"use client";

import {depositGoal, getGoals, Goal, type GoalType} from "@/entities/goal";
import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {Plus} from "@/shared/ui/icons/Plus";
import {CreateGoal} from "@/features/create-goal";
import {useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {AnimatePresence} from "framer-motion";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import {DepositModal} from "@/widgets/deposit-modal/ui/DepositModal";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";

type Props = {
    className?: string;
    goalsInitial: GoalType[];
}

const Goals = ({className, goalsInitial}: Props) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const {data: goals = []} = useQuery({
        queryKey: ["goals"],
        initialData: goalsInitial,
        queryFn: getGoals,
        refetchInterval: REFETCH_INTERVAL,
        staleTime: REFETCH_INTERVAL,
    });

    const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
    const [isModalActive, setModalActive] = useState(false);

    function selectGoal(goal: GoalType) {
        setSelectedGoal(goal);
        setModalActive(true);
    }

    const queryClient = useQueryClient();

    function onDeposit() {
        queryClient.invalidateQueries({queryKey: ["goals"]});
        queryClient.invalidateQueries({queryKey: ["child-accounts"]});
        queryClient.invalidateQueries({queryKey: ["child-transactions"]});
        queryClient.invalidateQueries({queryKey: ["child-transaction-categories"]});
        queryClient.invalidateQueries({queryKey: ["wallets"]});
    }

    return <section className={`${className} mb-[1.875rem] md:p-3 md:rounded-2xl md:bg-sky-50`}>
        <div className="flex items-center justify-between mb-2.5 flex-wrap">
            <Heading level={2}>Наши цели</Heading>
            <AccentButton textLarge onClick={() => setModalOpen(true)}>
                <Plus className="mr-1"/>
                Создать новую цель
            </AccentButton>
        </div>
        <div className="flex gap-1 flex-col">
            <AnimatePresence>
                {goals.length
                    ? goals.map((goal) => (<Goal onClick={selectGoal} key={goal.id} goal={goal}/>))
                    : <CollectionEmpty>У вас пока нет созданных целей</CollectionEmpty>
                }
            </AnimatePresence>
        </div>
        <CreateGoal isActive={isModalOpen} setActive={setModalOpen}/>
        <DepositModal activeAccountId={selectedGoal?.id} onSuccess={onDeposit} isActive={isModalActive}
                      setActive={setModalActive} entityName="goal" mutationFn={depositGoal}/>
    </section>
}

export default Goals;