import {Goal, type GoalType} from "@/entities/goal";
import Heading from "@/shared/ui/typography/Heading";

type Props = {
    goals: GoalType[]
};

const ShortGoals = ({goals}: Props) => {
    return <section className="mx-4 md:mx-0 md:mr-4 mb-5">
        <Heading level={2}>Наши цели</Heading>
        <div className="flex gap-1 flex-col">
            {goals.slice(0, 2).map((goal) => (<Goal key={goal.id} goal={goal}/>))}
        </div>
    </section>
}

export default ShortGoals;