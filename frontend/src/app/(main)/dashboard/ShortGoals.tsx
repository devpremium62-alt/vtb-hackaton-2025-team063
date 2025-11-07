"use client";

import {getGoals, Goal, type GoalType} from "@/entities/goal";
import Heading from "@/shared/ui/typography/Heading";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import {AnimatePresence} from "framer-motion";
import {useQuery} from "@tanstack/react-query";


const ShortGoals = () => {
    const {data: goals = []} = useQuery({
        queryKey: ["goals"],
        queryFn: getGoals,
    });

    return <section className="mx-4 md:mx-0 md:mr-4 mb-5">
        <Heading level={2}>Наши цели</Heading>
        <div className="flex gap-1 flex-col">
            <AnimatePresence>
                {goals.length
                    ? goals.slice(0, 2).map((goal) => (<Goal key={goal.id} goal={goal}/>))
                    : <CollectionEmpty>Целей пока нет</CollectionEmpty>
                }
            </AnimatePresence>
        </div>
    </section>
}

export default ShortGoals;