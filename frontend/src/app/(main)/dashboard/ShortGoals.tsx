"use client";

import {depositGoal, getGoals, Goal, type GoalType} from "@/entities/goal";
import Heading from "@/shared/ui/typography/Heading";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import {AnimatePresence} from "framer-motion";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {DepositModal} from "@/widgets/deposit-modal/ui/DepositModal";


const ShortGoals = () => {
    const {data: goals = []} = useQuery({
        queryKey: ["goals"],
        queryFn: getGoals,
        refetchInterval: 5000
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
    }

    return <section className="mx-4 md:mx-0 md:mr-4 mb-5">
        <Heading className="mb-1" level={2}>Наши цели</Heading>
        <div className="flex gap-1 flex-col">
            <AnimatePresence>
                {goals.length
                    ? goals.slice(0, 2).map((goal) => (<Goal onClick={selectGoal} key={goal.id} goal={goal}/>))
                    : <CollectionEmpty>У вас пока нет созданных целей</CollectionEmpty>
                }
            </AnimatePresence>
        </div>
        <DepositModal activeAccountId={selectedGoal?.id} onSuccess={onDeposit} isActive={isModalActive}
                      setActive={setModalActive} entityName="goal" mutationFn={depositGoal}/>
    </section>
}

export default ShortGoals;