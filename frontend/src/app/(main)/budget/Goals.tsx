"use client";

import {getGoals, Goal} from "@/entities/goal";
import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {Plus} from "@/shared/ui/icons/Plus";
import {CreateGoal} from "@/widgets/create-goal";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {AnimatePresence} from "framer-motion";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";

const Goals = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    const {data: goals = []} = useQuery({
        queryKey: ["goals"],
        queryFn: getGoals,
    });

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="flex items-center justify-between mb-2.5">
            <Heading level={2}>Наши цели</Heading>
            <AccentButton onClick={() => setModalOpen(true)}>
                <Plus className="mr-1"/>
                Создать новую цель
            </AccentButton>
        </div>
        <div className="flex gap-1 flex-col">
            <AnimatePresence>
                {goals.length
                    ? goals.map((goal) => (<Goal key={goal.id} goal={goal}/>))
                    : <CollectionEmpty>Целей пока нет</CollectionEmpty>
                }
            </AnimatePresence>

        </div>
        <CreateGoal isActive={isModalOpen} setActive={setModalOpen}/>
    </section>
}

export default Goals;