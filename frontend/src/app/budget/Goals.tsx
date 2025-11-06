import {Goal, type GoalType} from "@/entities/goal";
import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {Plus} from "@/shared/ui/icons/Plus";

type Props = {
    goals: GoalType[]
};

const Goals = ({goals}: Props) => {
    return <section className="mx-4 md:mx-0 md:mr-4 mb-[1.875rem]">
        <div className="flex items-center justify-between mb-2.5">
            <Heading level={2}>Наши цели</Heading>
            <AccentButton>
                <Plus className="mr-1" />
                Создать новую цель
            </AccentButton>
        </div>
        <div className="flex gap-1 flex-col">
            {goals.map((goal) => (<Goal key={goal.id} goal={goal}/>))}
        </div>
    </section>
}

export default Goals;