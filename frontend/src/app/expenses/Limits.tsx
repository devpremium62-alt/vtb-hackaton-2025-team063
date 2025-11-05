import {Limit, LimitType} from "@/entities/limit";
import Heading from "@/shared/ui/typography/Heading";

type Props = {
    limits: LimitType[];
}

const Limits = ({limits}: Props) => {
    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <Heading level={2}>Лимиты трат</Heading>
        <div className="flex gap-1 flex-col">
            {limits.map((limit) => (
                <Limit key={limit.category.name} limit={limit} />
            ))}
        </div>
    </section>;
}

export default Limits;