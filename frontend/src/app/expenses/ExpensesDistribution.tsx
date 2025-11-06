import Heading from "@/shared/ui/typography/Heading";
import React from "react";
import DonutChart from "@/shared/ui/charts/DonutChart";
import Image from "next/image";

type PersonExpenses = {
    avatar: string;
    value: number;
}

type Props = {
    firstPerson: PersonExpenses;
    secondPerson: PersonExpenses;
}

const ExpensesDistributions = ({firstPerson, secondPerson}: Props) => {
    const firstPersonData = [{value: firstPerson.value, color: "var(--primary-color)", label: true}, {value: secondPerson.value, color: "var(--icons-inactive)"}];
    const secondPersonData = [{value: firstPerson.value, color: "var(--icons-inactive)"}, {value: secondPerson.value, color: "var(--primary-color)", label: true}];

    return <section className="mx-4 md:mx-0 md:mr-4 mb-20">
        <div className="mb-2.5">
            <Heading level={2}>Распределение трат</Heading>
        </div>
        <div className="flex items-center flex-col xxs:flex-row">
            <DonutChart data={firstPersonData} size={80} height={200}>
                <Image className="rounded-full" width={48} height={48} src={firstPerson.avatar} alt=""/>
            </DonutChart>
            <DonutChart data={secondPersonData} size={80} height={200}>
                <Image className="rounded-full" width={48} height={48} src={secondPerson.avatar} alt=""/>
            </DonutChart>
        </div>
    </section>;
}

export default ExpensesDistributions;